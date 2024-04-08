import { gql } from '@apollo/client';

export const GET_CATEGORIES = gql`
	query CollectionList($timezone: String!, $geoArea: [[Float!]!], $limit: Int) {
		collectionFeed(
			timezone: $timezone
			contextGeoArea: $geoArea
			limit: $limit
			tagNames: ["categories"]
		) {
			cursor {
				next
			}
			collections {
				id
				name
				slug
			}
		}
	}
`;

export const GET_COLLECTION_BUSINESS_LIST = gql`
	query CollectionBusinessesList(
		$id: ID!
		$geoArea: [[Float!]!]
		$orderPoint: [Float!]
		$limit: Int
		$q: String
	) {
		collection(collectionId: $id) {
			businessFeed(orderingGeoPoint: $orderPoint, limit: $limit, , q: $q) {
				cursor {
					next
				}
				businesses {
					id
					name
					profileImages {
						url
					}
					offers(contextGeoArea: $geoArea) {
						id
						headline
						subhead
						flags
						heroImages {
							url
						}
						locations(contextGeoArea: $geoArea, orderingGeoPoint: $orderPoint) {
							id
							address {
								nameShort
								city
								state
								postalcode
							}
						}
					}
				}
			}
		}
	}
`;