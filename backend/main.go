package main

import (
    "net/http"
    "github.com/labstack/echo/v4"
    "github.com/labstack/echo/v4/middleware"
)

type Item struct {
    ID   string `json:"id"`
    Name string `json:"name"`
}

var items = map[string]Item{}
var idCounter = 1

func main() {
    e := echo.New()
    e.Use(middleware.Logger())
    e.Use(middleware.Recover())
    e.Use(middleware.CORS())

    // Create an item
    e.POST("/api/items", func(c echo.Context) error {
        item := Item{
            ID:   string(idCounter),
            Name: c.FormValue("name"),
        }
        items[item.ID] = item
        idCounter++
        return c.JSON(http.StatusCreated, item)
    })

    // Get all items
    e.GET("/api/items", func(c echo.Context) error {
        itemList := []Item{}
        for _, item := range items {
            itemList = append(itemList, item)
        }
        return c.JSON(http.StatusOK, itemList)
    })

    // Get an item by ID
    e.GET("/api/items/:id", func(c echo.Context) error {
        id := c.Param("id")
        item, exists := items[id]
        if !exists {
            return c.JSON(http.StatusNotFound, map[string]string{"error": "Item not found"})
        }
        return c.JSON(http.StatusOK, item)
    })

    // Update an item by ID
    e.PUT("/api/items/:id", func(c echo.Context) error {
        id := c.Param("id")
        item, exists := items[id]
        if !exists {
            return c.JSON(http.StatusNotFound, map[string]string{"error": "Item not found"})
        }
        item.Name = c.FormValue("name")
        items[id] = item
        return c.JSON(http.StatusOK, item)
    })

    // Delete an item by ID
    e.DELETE("/api/items/:id", func(c echo.Context) error {
        id := c.Param("id")
        _, exists := items[id]
        if !exists {
            return c.JSON(http.StatusNotFound, map[string]string{"error": "Item not found"})
        }
        delete(items, id)
        return c.NoContent(http.StatusNoContent)
    })

    e.Logger.Fatal(e.Start(":8080"))
}
