package main

import (
	"fmt"
	"strings"

	"github.com/mmyoji/aoc/2020/utils"
)

type passport struct {
	byr string // (Birth Year)
	iyr string // (Issue Year)
	eyr string // (Expiration Year)
	hgt string // (Height)
	hcl string // (Hair Color)
	ecl string // (Eye Color)
	pid string // (Passport ID)
	cid string // (Country ID) optional
}

func buildPassport(line string) passport {
	kvs := strings.Split(line, " ")
	pp := passport{}
	for _, kv := range kvs {
		kvArr := strings.Split(kv, ":")
		switch kvArr[0] {
		case "byr":
			pp.byr = kvArr[1]
		case "iyr":
			pp.iyr = kvArr[1]
		case "eyr":
			pp.eyr = kvArr[1]
		case "hgt":
			pp.hgt = kvArr[1]
		case "hcl":
			pp.hcl = kvArr[1]
		case "ecl":
			pp.ecl = kvArr[1]
		case "pid":
			pp.pid = kvArr[1]
		case "cid":
			pp.cid = kvArr[1]
		default:
			fmt.Printf("Invalid key=%s\n", kvArr[0])
		}
	}
	return pp
}

func (pp passport) isValid() bool {
	requiredFields := []string{
		pp.byr,
		pp.iyr,
		pp.eyr,
		pp.hgt,
		pp.hcl,
		pp.ecl,
		pp.pid,
	}
	for _, v := range requiredFields {
		if v == "" {
			return false
		}
	}

	return true
}

func main() {
	lines, err := utils.GetLines("day04/inputs.txt")
	utils.Fatal(err)

	ppIndex := 0
	ppStrings := []string{}
	for _, l := range lines {
		if l == "" {
			ppIndex++
			continue
		}

		if len(ppStrings) <= ppIndex {
			ppStrings = append(ppStrings, l)
		} else {
			ppStrings[ppIndex] += (" " + l)
		}
	}

	validPassportsCount := 0

	for _, l := range ppStrings {
		pp := buildPassport(l)
		if pp.isValid() {
			validPassportsCount++
		}
	}

	fmt.Printf("answer: %d\n", validPassportsCount)
	// 204
}
