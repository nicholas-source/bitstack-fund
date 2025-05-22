;; BitStackFund: Decentralized Crowdfunding Protocol
;;
;; A trustless crowdfunding platform built on Stacks and secured by Bitcoin.
;; Enables creators to raise funds through transparent, accountable campaigns
;; with built-in governance mechanisms and automatic fund distribution.
;;
;; Features:
;; - Secure fundraising with STX tokens
;; - Contributor voting for project accountability
;; - Automatic fund distribution upon goal achievement
;; - Guaranteed refunds for unsuccessful campaigns
;; - Flexible campaign parameters
;;

;; Constants

;; Access Control
(define-constant CONTRACT_OWNER tx-sender)

;; Error Codes
(define-constant ERR_UNAUTHORIZED (err u100))
(define-constant ERR_CAMPAIGN_NOT_FOUND (err u101))
(define-constant ERR_CAMPAIGN_ENDED (err u102))
(define-constant ERR_CAMPAIGN_ACTIVE (err u103))
(define-constant ERR_GOAL_NOT_MET (err u104))
(define-constant ERR_ALREADY_REFUNDED (err u105))
(define-constant ERR_NO_CONTRIBUTION (err u106))
(define-constant ERR_INVALID_AMOUNT (err u107))
(define-constant ERR_INVALID_PARAMETERS (err u108))
(define-constant ERR_VOTING_PERIOD_ENDED (err u109))
(define-constant ERR_ALREADY_VOTED (err u110))
(define-constant ERR_INSUFFICIENT_VOTING_POWER (err u111))
(define-constant ERR_CONTRIBUTOR_LIST_FULL (err u112))

;; Campaign Status Codes
(define-constant STATUS_ACTIVE u1)
(define-constant STATUS_SUCCESSFUL u2)
(define-constant STATUS_FAILED u3)
(define-constant STATUS_CANCELLED u4)

;; Data Variables

(define-data-var campaign-counter uint u0)
(define-data-var platform-fee-rate uint u250) ;; 2.5% (250/10000)

;; Data Maps

;; Campaign Data Structure
(define-map campaigns
    { campaign-id: uint }
    {
        creator: principal,
        title: (string-ascii 64),
        description: (string-ascii 256),
        goal: uint,
        raised: uint,
        deadline-height: uint,
        created-height: uint,
        status: uint,
        voting-enabled: bool,
        voting-deadline-height: uint,
        votes-for: uint,
        votes-against: uint,
        min-contribution: uint,
    }
)

;; Contribution Tracking
(define-map contributions
    {
        campaign-id: uint,
        contributor: principal,
    }
    {
        amount: uint,
        refunded: bool,
        voting-power: uint,
    }
)

;; Voting Records
(define-map contributor-votes
    {
        campaign-id: uint,
        voter: principal,
    }
    {
        voted: bool,
        vote-for: bool,
    }
)

;; Campaign Contributors List
(define-map campaign-contributors
    { campaign-id: uint }
    { contributor-list: (list 500 principal) }
)

;; Read-only Functions

;; Get campaign details by ID
(define-read-only (get-campaign (campaign-id uint))
    (map-get? campaigns { campaign-id: campaign-id })
)

;; Get contribution details for a specific campaign and contributor
(define-read-only (get-contribution
        (campaign-id uint)
        (contributor principal)
    )
    (map-get? contributions {
        campaign-id: campaign-id,
        contributor: contributor,
    })
)

;; Get total number of campaigns created
(define-read-only (get-campaign-count)
    (var-get campaign-counter)
)

;; Get current platform fee rate
(define-read-only (get-platform-fee-rate)
    (var-get platform-fee-rate)
)

;; Check if a campaign is still active
(define-read-only (is-campaign-active (campaign-id uint))
    (match (get-campaign campaign-id)
        campaign (and
            (is-eq (get status campaign) STATUS_ACTIVE)
            (< stacks-block-height (get deadline-height campaign))
        )
        false
    )
)

;; Check if a campaign has met its funding goal
(define-read-only (is-campaign-successful (campaign-id uint))
    (match (get-campaign campaign-id)
        campaign (>= (get raised campaign) (get goal campaign))
        false
    )
)

;; Calculate platform fee for a given amount
(define-read-only (calculate-platform-fee (amount uint))
    (/ (* amount (var-get platform-fee-rate)) u10000)
)

;; Get voter status for a specific campaign
(define-read-only (get-vote-status
        (campaign-id uint)
        (voter principal)
    )
    (map-get? contributor-votes {
        campaign-id: campaign-id,
        voter: voter,
    })
)

;; Private Functions

;; Add a contributor to the campaign's contributor list
(define-private (add-contributor-to-list
        (campaign-id uint)
        (contributor principal)
    )
    (let ((current-list (default-to (list)
            (get contributor-list
                (map-get? campaign-contributors { campaign-id: campaign-id })
            ))))
        (if (< (len current-list) u500)
            (begin
                (map-set campaign-contributors { campaign-id: campaign-id } { contributor-list: (unwrap! (as-max-len? (append current-list contributor) u500)
                    ERR_CONTRIBUTOR_LIST_FULL
                ) }
                )
                (ok true)
            )
            (ok true)
        )
    )
)

;; Update campaign status based on current blockchain height
(define-private (update-campaign-status (campaign-id uint))
    (match (get-campaign campaign-id)
        campaign (begin
            (if (>= stacks-block-height (get deadline-height campaign))
                (if (>= (get raised campaign) (get goal campaign))
                    (map-set campaigns { campaign-id: campaign-id }
                        (merge campaign { status: STATUS_SUCCESSFUL })
                    )
                    (map-set campaigns { campaign-id: campaign-id }
                        (merge campaign { status: STATUS_FAILED })
                    )
                )
                true
            )
            true
        )
        false
    )
)

;; Public Functions

;; Create a new crowdfunding campaign
(define-public (create-campaign
        (title (string-ascii 64))
        (description (string-ascii 256))
        (goal uint)
        (duration-blocks uint)
        (voting-enabled bool)
        (voting-duration-blocks uint)
        (min-contribution uint)
    )
    (let (
            (campaign-id (+ (var-get campaign-counter) u1))
            (deadline-height (+ stacks-block-height duration-blocks))
            (voting-deadline (if voting-enabled
                (+ deadline-height voting-duration-blocks)
                deadline-height
            ))
        )
        (asserts! (> goal u0) ERR_INVALID_PARAMETERS)
        (asserts! (> duration-blocks u0) ERR_INVALID_PARAMETERS)
        (asserts! (> min-contribution u0) ERR_INVALID_PARAMETERS)
        (map-set campaigns { campaign-id: campaign-id } {
            creator: tx-sender,
            title: title,
            description: description,
            goal: goal,
            raised: u0,
            deadline-height: deadline-height,
            created-height: stacks-block-height,
            status: STATUS_ACTIVE,
            voting-enabled: voting-enabled,
            voting-deadline-height: voting-deadline,
            votes-for: u0,
            votes-against: u0,
            min-contribution: min-contribution,
        })
        (var-set campaign-counter campaign-id)
        (ok campaign-id)
    )
)

;; Contribute STX to a campaign
(define-public (contribute
        (campaign-id uint)
        (amount uint)
    )
    (let (
            (campaign (unwrap! (get-campaign campaign-id) ERR_CAMPAIGN_NOT_FOUND))
            (existing-contribution (default-to {
                amount: u0,
                refunded: false,
                voting-power: u0,
            }
                (get-contribution campaign-id tx-sender)
            ))
            (new-amount (+ (get amount existing-contribution) amount))
            (voting-power (if (get voting-enabled campaign)
                amount
                u0
            ))
        )
        (asserts! (is-campaign-active campaign-id) ERR_CAMPAIGN_ENDED)
        (asserts! (>= amount (get min-contribution campaign)) ERR_INVALID_AMOUNT)
        ;; Transfer STX to contract
        (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
        ;; Update contribution
        (map-set contributions {
            campaign-id: campaign-id,
            contributor: tx-sender,
        } {
            amount: new-amount,
            refunded: false,
            voting-power: (+ (get voting-power existing-contribution) voting-power),
        })
        ;; Update campaign raised amount
        (map-set campaigns { campaign-id: campaign-id }
            (merge campaign { raised: (+ (get raised campaign) amount) })
        )
        ;; Add contributor to list
        (try! (add-contributor-to-list campaign-id tx-sender))
        (ok true)
    )
)