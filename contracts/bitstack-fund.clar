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

;; Claim funds for a successful campaign (creator only)
(define-public (claim-funds (campaign-id uint))
    (let (
            (campaign (unwrap! (get-campaign campaign-id) ERR_CAMPAIGN_NOT_FOUND))
            (platform-fee (calculate-platform-fee (get raised campaign)))
            (creator-amount (- (get raised campaign) platform-fee))
        )
        (update-campaign-status campaign-id)
        (asserts! (is-eq (get creator campaign) tx-sender) ERR_UNAUTHORIZED)
        (asserts! (>= stacks-block-height (get deadline-height campaign))
            ERR_CAMPAIGN_ACTIVE
        )
        (asserts! (is-campaign-successful campaign-id) ERR_GOAL_NOT_MET)
        ;; Handle voting if enabled
        (if (get voting-enabled campaign)
            (begin
                (asserts!
                    (>= stacks-block-height (get voting-deadline-height campaign))
                    ERR_VOTING_PERIOD_ENDED
                )
                (asserts!
                    (> (get votes-for campaign) (get votes-against campaign))
                    ERR_GOAL_NOT_MET
                )
            )
            true
        )
        ;; Transfer funds to creator (minus platform fee)
        (try! (as-contract (stx-transfer? creator-amount tx-sender (get creator campaign))))
        ;; Transfer platform fee to contract owner
        (if (> platform-fee u0)
            (try! (as-contract (stx-transfer? platform-fee tx-sender CONTRACT_OWNER)))
            true
        )
        (ok true)
    )
)

;; Request refund for failed campaigns
(define-public (request-refund (campaign-id uint))
    (let (
            (campaign (unwrap! (get-campaign campaign-id) ERR_CAMPAIGN_NOT_FOUND))
            (contribution (unwrap! (get-contribution campaign-id tx-sender) ERR_NO_CONTRIBUTION))
        )
        (update-campaign-status campaign-id)
        (asserts! (not (get refunded contribution)) ERR_ALREADY_REFUNDED)
        (asserts! (>= stacks-block-height (get deadline-height campaign))
            ERR_CAMPAIGN_ACTIVE
        )
        (asserts! (not (is-campaign-successful campaign-id)) ERR_GOAL_NOT_MET)
        ;; Mark as refunded
        (map-set contributions {
            campaign-id: campaign-id,
            contributor: tx-sender,
        }
            (merge contribution { refunded: true })
        )
        ;; Transfer refund
        (try! (as-contract (stx-transfer? (get amount contribution) tx-sender tx-sender)))
        (ok true)
    )
)

;; Vote on a campaign during voting period
(define-public (vote
        (campaign-id uint)
        (vote-for bool)
    )
    (let (
            (campaign (unwrap! (get-campaign campaign-id) ERR_CAMPAIGN_NOT_FOUND))
            (contribution (unwrap! (get-contribution campaign-id tx-sender) ERR_NO_CONTRIBUTION))
            (existing-vote (map-get? contributor-votes {
                campaign-id: campaign-id,
                voter: tx-sender,
            }))
        )
        (asserts! (get voting-enabled campaign) ERR_UNAUTHORIZED)
        (asserts! (>= stacks-block-height (get deadline-height campaign))
            ERR_CAMPAIGN_ACTIVE
        )
        (asserts! (< stacks-block-height (get voting-deadline-height campaign))
            ERR_VOTING_PERIOD_ENDED
        )
        (asserts! (is-none existing-vote) ERR_ALREADY_VOTED)
        (asserts! (> (get voting-power contribution) u0)
            ERR_INSUFFICIENT_VOTING_POWER
        )
        ;; Record vote
        (map-set contributor-votes {
            campaign-id: campaign-id,
            voter: tx-sender,
        } {
            voted: true,
            vote-for: vote-for,
        })
        ;; Update vote counts
        (if vote-for
            (map-set campaigns { campaign-id: campaign-id }
                (merge campaign { votes-for: (+ (get votes-for campaign) (get voting-power contribution)) })
            )
            (map-set campaigns { campaign-id: campaign-id }
                (merge campaign { votes-against: (+ (get votes-against campaign) (get voting-power contribution)) })
            )
        )
        (ok true)
    )
)

;; Cancel an active campaign (creator only)
(define-public (cancel-campaign (campaign-id uint))
    (let ((campaign (unwrap! (get-campaign campaign-id) ERR_CAMPAIGN_NOT_FOUND)))
        (asserts! (is-eq (get creator campaign) tx-sender) ERR_UNAUTHORIZED)
        (asserts! (is-eq (get status campaign) STATUS_ACTIVE) ERR_CAMPAIGN_ENDED)
        (map-set campaigns { campaign-id: campaign-id }
            (merge campaign { status: STATUS_CANCELLED })
        )
        (ok true)
    )
)

;; Admin Functions

;; Set platform fee rate (owner only)
(define-public (set-platform-fee-rate (new-rate uint))
    (begin
        (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)
        (asserts! (<= new-rate u1000) ERR_INVALID_PARAMETERS) ;; Max 10%
        (var-set platform-fee-rate new-rate)
        (ok true)
    )
)

;; Emergency pause for a campaign (owner only)
(define-public (emergency-pause-campaign (campaign-id uint))
    (let ((campaign (unwrap! (get-campaign campaign-id) ERR_CAMPAIGN_NOT_FOUND)))
        (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)
        (map-set campaigns { campaign-id: campaign-id }
            (merge campaign { status: STATUS_CANCELLED })
        )
        (ok true)
    )
)
