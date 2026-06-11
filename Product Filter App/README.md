# Product Filter App

A simple web application that displays products and allows users to filter them by **category** and **price range** using dropdown menus.

## Project Overview
This project demonstrates how to use **JavaScript arrays, objects, DOM manipulation, and events** to dynamically render and filter products.  
Products are fetched from an API and displayed on the page, and users can filter them based on their preferences.

## Features
- Display products dynamically from an API
- Filter products by **category**
- Filter products by **price range**
- Responsive product card layout
- Loading indicator while fetching products
- Uses dropdown menus for filtering

## Technologies Used
- **HTML5** – Structure of the web page  
- **CSS3** – Styling and layout  
- **JavaScript (ES6)** – Application logic  
- **DOM Manipulation** – Rendering products dynamically  
- **Fetch API** – Retrieving product data

## Project Structure
```
project-folder
│
├── index.html
├── css/
│ └── style.css
| └── all.min.css
├── js/
│ └── main.js
├── images/
│ └── back.png
├── webfonts/
└── README.md
```


## How It Works
1. The application fetches product data from an API.
2. Products are stored in a JavaScript array.
3. The page renders product cards dynamically using DOM manipulation.
4. When a user selects a **category or price filter**, the `Array.filter()` method is used to filter the products.
5. The filtered results are rendered again on the page.

## Installation / Running the Project
1. Clone the repository:
git clone https://github.com/ItcProjects-R4/GHR4_SWD2_S1_PROJECT5

2. Open the project folder.

3. Run the project by opening **index.html** in your browser.

## Learning Objectives
This project was created to practice:
- Working with **JavaScript arrays and objects**
- Using **Array.filter()**
- Handling **DOM events**
- Rendering dynamic content in the browser

## Contributors
- Team 5 members of the SWD2_S1 Project
- Contributions include HTML structure, CSS styling, and JavaScript functionality.
