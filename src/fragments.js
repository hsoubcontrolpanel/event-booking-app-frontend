import { gql } from '@apollo/client'
export const EVENT_FIELDS = gql `
    fragment EventFields on Event {
        _id
        title
        price
        date
        description
    }
`