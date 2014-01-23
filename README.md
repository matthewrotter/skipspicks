skipspicks
==========

Skip's Picks v.3

ToDo:

- Add Location creation/update/review UI
- menu slide from right to left
  - move map and center when menu slides out
- add search
- add filters
- add user favoriting (localStorage)
- add user creation interface
- hanlde 300ms delay!-
- move context menu based on orientation 
- optimize location grabbing 
- empty tray on close? or at Lear scroll up
- CACHE Config from mongo, on server and/or in client
- Add indexes
- replace pins with vectoricons
- make bigger on click
- don't use popup use context box 
- 

        replace: {
          servers: {
            src: ['../clients/*/dist/assets/js/code*'],
            overwrite: true,
            replacements: [
              {
                from: /(SERVICE_HOST.?\*\/.?['"])([^']+)/g,
                to: '$1<%= pkg.globesherpa.serviceHost %>'
              }
           ]
         }
       }
     });

    grunt.loadNpmTasks('grunt-text-replace');
    
back
