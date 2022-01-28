package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
)

func post(w http.ResponseWriter, r *http.Request) {
	data, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Println("Could not read request;", err)
	}
	defer r.Body.Close()

	fmt.Println(string(data))
}

func main() {

	http.HandleFunc("/", post)

	http.ListenAndServe("localhost:9393", nil)

}
