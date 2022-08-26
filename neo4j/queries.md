# Queries

The Fulltext Index for titles and descriptions is required for the search feature of the explore page:

    create fulltext index titlesAndDescriptions FOR (n:Tutorial|Course|Chapter) on each [n.title, n.description]

User Search Index:

    create fulltext index usersByNameOrEmail FOR (n:User) on each [n.firstname, n.lastname, n.email]
