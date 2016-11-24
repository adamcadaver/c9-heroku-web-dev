# Getting Started

I used a bare [Cloud 9](c9.io) VM as my development machine. I really recommend using them if you don't have an environment set up locally.

## Before you start
* Download and install [node](https://nodejs.org/en/)
* check [git](https://git-scm.com/) is installed localled by entering the command `git --version` into your terminal.

## Instructions
```
mkdir myapp
cd myapp
npm init
npm install --save express path
touch index.js
```
Enter the following code into index.js:
```javascript
var path = require('path');
var express = require('express');
var app = express();

// sets the default PORT where our app listens for incoming requests
app.set('port', (process.env.PORT || 5000));

// tell the server to respond with hello world at the root URL
app.get('/', function (req, res) {
  res.send('Hello World!');
});

// writes to the command line what PORT our app is using
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
```

You have written your first Express.js web server! just run `node index.js` and go to localhost:5000 (or if you are using Cloud 9 https://project-username.c9users.io) and you will see your 'Hello World!'

Now let's build our web app. In this guide we are going make a page that queries [Flickr](flickr.com) for pictures based on tags we enter into an input box. First things first, lets get a html page where we can put our code.

* stop your web server running.
* Create `index.html', this will be where we put all of our UI code.
* In `index.js`, change line 10 to
```
res.sendFile(path.join(__dirname + '/index.html'));
```
This tells your express code to return the our new `index.html` file.
`__dirname` is a constant in Node which stores in which directory Node is running.

* Add the following to `index.html`
```html
<!DOCTYPE html>
<html>
    <head>
    </head>
    <body>
        My first site!
    </body>
</html>
```
Now if you restart your node server using `node index.js` you will see that it loads your html now!
Next let's make it do something. We are using the popular Angular framework.
change your html to:
```html
<!DOCTYPE html>
<html>
    <head>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.8/angular.min.js"></script>
<script>
angular.module('formFlickr', [])
    .controller('FlickrController', ['$scope', '$http', function ($scope, $http) {
    $scope.images = {};
    
    $scope.search = function (tags) {
    // build URL for Flickr API
    var flickrAPI = "https://api.flickr.com/services/feeds/photos_public.gne";
    
    flickrAPI = flickrAPI + "?jsoncallback=JSON_CALLBACK"
    + "&tags=" + encodeURIComponent($scope.tags)
    + "&tagmode=all"
    + "&format=json";
    
    $http.jsonp(flickrAPI)
    .success(function (data, status, headers, config) {
    $scope.images = data;
    $scope.imagesStatus = status;
})
};
}]);
</script>
    </head>
    <body ng-app="formFlickr" ng-controller="FlickrController">
        <h1>Search Images with Flickr API</h1>
        <form>
            <input ng-model="tags"/>
            <br />
            <button type="submit" ng-click="search(tags)">
                Search Flicker
            </button>
        </form>
        <div ng-if="images.items.length > 0">
            <h3>
                {{images.title}}
            </h3>
            <figure ng-repeat="i in images.items">
                <img src="{{i.media.m}}" />
                <figcaption>{{i.title}}</figcaption>
            </figure>
        </div>
    </body>
</html>
```
It works! try it out! Most popular web companies have similar APIs, try to integrate another if you like!

Next, we can separate our Javascript code from our html so it is a bit easier to work with. Create a new `public` folder in 'myapp'. We need to give our service permission to access files, so, after 
```javascript
app.set('port', (process.env.PORT || 5000));
```
add the following lines to `index.js`
```javascript
// exposes the public folder to be exposed to incoming requests
app.use("/public", express.static(__dirname + '/public'));
```
Now make a new `app.js` files in the public folder and and it the code you had in your script tag in `index.html` before. It should look something like

```javascript
angular.module('formFlickr', [])
    .controller('FlickrController',
        ['$scope', '$http', function ($scope, $http) {
            $scope.images = {};
            
            $scope.search = function (tags) {
            // build URL for Flickr API
            var flickrAPI = "https://api.flickr.com/services/feeds/photos_public.gne";
            
            flickrAPI = flickrAPI + "?jsoncallback=JSON_CALLBACK"
            + "&tags=" + encodeURIComponent($scope.tags)
            + "&tagmode=all"
            + "&format=json";
            
            $http
                .jsonp(flickrAPI)
                .success(
                    function (data, status, headers, config) {
                        $scope.images = data;
                        $scope.imagesStatus = status;
                    }
                )
            };
}]);
```

and replace the now empty script tag in `index.html` with a script tag that says where the code now is

```javascript
<script src="public/app.js"></script>
```

Now we just need to save all our changes using git!

```
git init
git add . // this assumes we are in /myapp not in /myapp/public
git commit -m "my first web app"
```

## Deploy to Heroku
* Get a Heroku account
* We need a specify a npm start script so Heroku will know what to run when we send it our code. Update the `scripts` property in `package.json` to
```json
"scripts": {
    "start": "node index.js"
 },
```
* Check your new script works by running `npm start`
Now
```
heroku login // enter login credentials
heroku create
git push heroku master
heroku open // or if using cloud9 just got to the url mentioned in the output of the previous command
```
