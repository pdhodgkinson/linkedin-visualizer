#!/usr/bin/env node
var main = require('lib/main'),
    argv = require('minimist')(process.argv.slice(2));

/****
 * Attach project to job
 */
// ./linker -f full.json --job-id 129241549 --project-id 44 --start-date 2013/03 --end-date 2013/12

// ./linker -f full.json --company "Fuel Industries" --project-name "Share Barney Hugs" --start-date 2013/01 --end-date 2013/04

/**
 * Attach skill to project or job
 */
/* 100% skill rate */
// ./linker -f full.json --project-id 44 --skill-id 1 

// ./linker -f full.json --job-id 129241549  --skill-nane "MySQL"

/* Different skill rate */
// ./linker -f full.json --company "Xandros Corporation" --skill-id 3 --rate 50

/* Specific Start Date  End Date
// ./linker -f full.json --project-id 44 --skill-nane "MySQL" --start-date 2012/04 --end-date 2012/12
 
 
