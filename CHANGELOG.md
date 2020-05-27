# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2020-05-27

### Changed
* Accept time off requests and calculate remaining balance.
* Create an event sourcing model to keep track of accrual and time off.
* Rename `PTOEngine#calculate` to `PTOEngine#balance` for clarity.
* Add `PTOEngine#history` to return a sequence of accrual change events.
