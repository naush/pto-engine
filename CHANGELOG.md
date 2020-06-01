# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.3] - 2020-06-01

### Fixed
* Correct last day of year detection

## [0.1.2] - 2020-05-31

### Fixed
* Correct biweekly behavior to match real world

## [0.1.1] - 2020-05-27

### Changed
* Allow original request fields to be returned to client

## [0.1.0] - 2020-05-27

### Changed
* Accept time off requests and calculate remaining balance.
* Create an event sourcing model to keep track of accrual and time off.
* Rename `PTOEngine#calculate` to `PTOEngine#balance` for clarity.
* Add `PTOEngine#history` to return a sequence of accrual change events.
