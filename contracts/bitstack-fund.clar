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
