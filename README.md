skipspicks
==========

Skip's Picks v.3


ToDo:

- move map and center when menu slides up
- add filters
- add user favoriting (localStorage)
- add user creation interface
~~ hanlde 300ms delay! ~~
- move context menu based on orientation 
- optimize location grabbing 
- empty tray on close? or at Lear scroll up
- CACHE Config from mongo, on server and/or in client
- Add indexes
- sort by created
  - index
- only pull deltas on map move and only remove hidden deltas, perhaps cache in case drag back?

- Editor
  - select location by map
  - geocode by name and give options

- marker icons
- handle map scroll
- context service
- generify for other layers, like footprint

- update Location updated on add review
- sort results on updated

- add location name on hover/ remove on hover out
- add loc name to search

- search:
  - case-insensitive
  - search by loc name
  - hit google places?
  - hide context on focus/search
  - add filters to settings menu
  - use SOLR for indexing?

- Alternate Features
  - New Apartment buildings
  - Drink index! collect more data on location entry/review
  - nearby mixed with places data 
  - price filter 
  - result list 
  - ratingfilter 
  - sort bys 
  - 

- IMPORT
  - downcase, or store a queryable substitute in separate field
  - migrate to geolocatoin
  - convert dates to epoch?

- Map
  - separate handlers for movend and dragend so can not refresh markers situationally
    - will have to extend the bound box beyond view at same time
  -