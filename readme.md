# Excercise Tracker App
## fCC Project

Code for full-stack excercise tracker app. Allows user to log excercises which are kept in a MongoDB database.

### Functionality
- Enter new username and create new user. Response is an object with following format.
```
{
username: "test User",
_id: "5fb5853f734231456ccb3b05"
}
```
- Retrieve list of all users by `GET` request to `[this_project_url]/api/users`. Response is an array where each element is an object literal containing a user's `username` and `_id`.
- `POST` to `api/users/:_id/excercises` with form data `description`, `duration`, and optionally `date`. If no data is supplied, the current date will be used. Response will be object literal with the following format.
```
{
username: "test User",
description: "test exercise",
duration: 45,
date: "Mon Jan 01 1990",
_id: "5fb5853f734231456ccb3b05"
}
```
Note date must be entered in yyyy-mm-dd format
- Retrieve exercise log of a user by making get request to `[this_project_url]/api/user/:_id/logs??[from][&to][&limit]`.
  - from, to and limit are optional filters for the exercise log.
  - from, to = dates (yyyy-mm-dd) - Only returns exercise entries that fall within this range.
  - limit = number - Only returns up to this number of entries in the log.

Recieve response with following format.
```
{
  username: "test User",
  count: 2,
  _id: "5fb5853f734231456ccb3b05",
  log: [{
    description: "test excercise",
    duration: 45,
    date: "Mon Jan 01 1990",
  },
  {
    description: "test excercise2",
    duration: 45,
    date: "Tue Jan 02 1990",
  }
  ]
}
```
