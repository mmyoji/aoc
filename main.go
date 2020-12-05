package main

import (
	"bufio"
	"fmt"
	"os"
)

func main() {
	Day2()
}

func getLines(pathname string) ([]string, error) {
	var lines = []string{}

	file, err := os.Open(pathname)
	if err != nil {
		return lines, fmt.Errorf("Failed to open file: %s", err)
	}

	scanner := bufio.NewScanner(file)
	scanner.Split(bufio.ScanLines)

	for scanner.Scan() {
		lines = append(lines, scanner.Text())
	}
	file.Close()

	return lines, nil
}
