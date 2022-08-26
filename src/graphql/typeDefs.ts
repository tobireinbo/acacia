import { gql } from "apollo-server-micro";

/*
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                                             │
│  ┌─────────────┐              ┌─────────────┐                                              ┌─────────────┐  │
│  │             │  HAS_CHAPTER │             │    HAS_TUTORIAL              HAS_TIMESLOT    │             │  │
│  │   Chapter   │◄─────────────┤  Tutorial   │◄───────────────────┐     ┌──────────────────►│   Timeslot  │  │
│  │             │              │             │                    │     │                   │             │  │
│  └─────────────┘              └─────────────┘                    │     │                   └──────┬──────┘  │
│                                                                  │     │                          │         │
│                                                                  │     │                          │         │
│                                                                  │     │              AT_LOCATION │         │
│                                                                  │     │                          │         │
│                                                                  │     │                          │         │
│                                                                  │     │                          ▼         │
│  ┌─────────────┐  SENT_MESSAGE┌─────────────┐PARTICIPATES_IN ┌───┴─────┴───┐               ┌─────────────┐  │
│  │             │◄─────────────┤             ├───────────────►│             │               │             │  │
│  │   Message   │              │    User     │                │   Course    │               │   Location  │  │
│  │             ├─────────────►│             │◄───────────────┤             │               │             │  │
│  └─────────────┘ MESSAGE_TO   └─────────────┘  HAS_LECTURER  └─────────────┘               └─────────────┘  │
│                                                                                                             │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
 */

export default gql`
  type User @node(label: "User") {
    uuid: ID! @id
    createdAt: DateTime @timestamp(operations: [CREATE])
    updatedAt: DateTime @timestamp(operations: [UPDATE])
    firstname: String!
    lastname: String!
    email: String!
    avatarUrl: String
    hashedPassword: String!
    salt: String
    isAdmin: Boolean @default(value: false)

    courses: [Course!]! @relationship(type: "PARTICIPATES_IN", direction: OUT)
    receivedMessages: [Message!]!
      @relationship(type: "MESSAGE_TO", direction: IN)
  }

  type Course @node(label: "Course") {
    uuid: ID! @id
    createdAt: DateTime @timestamp(operations: [CREATE])
    updatedAt: DateTime @timestamp(operations: [UPDATE])
    title: String!
    description: String

    participants: [User!]! @relationship(type: "PARTICIPATES_IN", direction: IN)
    lecturer: User @relationship(type: "HAS_LECTURER", direction: OUT)
    tutorials: [Tutorial!]! @relationship(type: "HAS_TUTORIAL", direction: OUT)
    timeslots: [Timeslot!]! @relationship(type: "HAS_TIMESLOT", direction: OUT)
  }

  type Tutorial @node(label: "Tutorial") {
    uuid: ID! @id
    createdAt: DateTime @timestamp(operations: [CREATE])
    updatedAt: DateTime @timestamp(operations: [UPDATE])
    title: String!
    description: String

    course: Course @relationship(type: "HAS_TUTORIAL", direction: IN)
    chapters: [Chapter!]! @relationship(type: "HAS_CHAPTER", direction: OUT)
  }

  type Chapter @node(label: "Chapter") {
    uuid: ID! @id
    createdAt: DateTime @timestamp(operations: [CREATE])
    updatedAt: DateTime @timestamp(operations: [UPDATE])
    title: String!
    position: Int
    markdown: String

    tutorial: Tutorial @relationship(type: "HAS_CHAPTER", direction: IN)
  }

  type Message @node(label: "Message") {
    uuid: ID! @id
    createdAt: DateTime @timestamp(operations: [CREATE])
    updatedAt: DateTime @timestamp(operations: [UPDATE])
    content: String!
    read: Boolean @default(value: false)

    sender: User @relationship(type: "SENT_MESSAGE", direction: IN)
    recipient: User @relationship(type: "MESSAGE_TO", direction: OUT)
  }

  type Timeslot @node(label: "Timeslot") {
    uuid: ID! @id
    createdAt: DateTime @timestamp(operations: [CREATE])
    updatedAt: DateTime @timestamp(operations: [UPDATE])
    startDate: DateTime!
    endDate: DateTime!
    reoccuring: Boolean @default(value: false)

    location: Location @relationship(type: "AT_LOCATION", direction: OUT)
    course: Course @relationship(type: "HAS_TIMESLOT", direction: IN)
  }

  type Location @node(label: "Location") {
    uuid: ID! @id
    createdAt: DateTime @timestamp(operations: [CREATE])
    updatedAt: DateTime @timestamp(operations: [UPDATE])
    title: String!

    timeslots: [Timeslot!]! @relationship(type: "AT_LOCATION", direction: IN)
  }

  union TitlesAndDescriptionsResult = Course | Tutorial | Chapter

  type Query {
    titlesAndDescriptions(searchString: String): [TitlesAndDescriptionsResult]
      @cypher(
        statement: """
        CALL db.index.fulltext.queryNodes(
          'titlesAndDescriptions', $searchString+'~')
        YIELD node RETURN node
        """
      )
  }

  type Query {
    usersByNameOrEmail(searchString: String): [User]
      @cypher(
        statement: """
        CALL db.index.fulltext.queryNodes(
          'usersByNameOrEmail', $searchString+'~')
        YIELD node RETURN node{.firstname, .lastname, .uuid, .email, .avatarUrl}
        """
      )
  }
`;
