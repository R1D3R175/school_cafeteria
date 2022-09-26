const excluded = {
    "food": [0],
    "drink": [0]
}

function get_dropdown_list_from(get_endpoint, get_type) {
    const $dropdown_list = $("<ul>", { "class": "dropdown-menu "})
    const exclude = (excluded[get_type].length >= 2 ? excluded[get_type] : "")
    const endpoint = [ get_endpoint, get_type, exclude.toString() ].join('/')
    $.ajax({
        method: "GET",
        url: endpoint,
        dataType: "json",
        success: function(results) {
            if(results[get_type].length === 0) {
                $("<li>").append($("<a>", {
                    text: "You have already added all drinks",
                    "class": "dropdown-item disabled",
                    "href": "#",
                    "unusable": ""
                })).appendTo($dropdown_list)
            } else {
                for (const result of results[get_type]) {
                    $("<li>").append($("<a>", {
                        text: result["name"],
                        "class": `dropdown-item ${get_type}`,
                        "href": "#",
                        "api_source": [ get_endpoint, get_type ].join('/'),
                        "api_type": get_type,
                        "api_id": result['id']
                    })).appendTo($dropdown_list)
                }
            }
        }
    })

    return $dropdown_list
}

function create_dropdown_from(get_endpoint, get_type, button_text) { 
    const $dropdown_list = get_dropdown_list_from(get_endpoint, get_type)
    const $dropdown = $("<div>", { 
        "class": `dropdown`
    })   
    const $dropdown_button = $("<button>", {
        text: button_text,
        "class": "btn btn-secondary dropdown-toggle",
        "type": "button",
        "data-bs-toggle": "dropdown",
        "aria-expanded": "false"
    })

    $dropdown.append($dropdown_button, $dropdown_list)

    return $dropdown
}

function create_dropdowns() {
    const $food_dropdown = create_dropdown_from("/api/get", "food", "Add food")
    const $drink_dropdown = create_dropdown_from("/api/get", "drink", "Add drink")
    return [ $food_dropdown, $drink_dropdown ]
}

function create_form() {
    const $form_container = $("#order-container")
    const [ $food_dropdown, $drink_dropdown] = create_dropdowns()    
    $form_container.append($food_dropdown, $drink_dropdown)

    $("<button>", {
        text: "Order",
        "type": "submit",
        "class": "btn btn-primary"
    }).appendTo($("#order-form"))
}

function get_by_id(endpoint, id) {
    endpoint += `/${id}`

    return Promise.resolve($.ajax({
        method: "GET",
        url: endpoint,
        dataType: "json",
    }))
}

$(document).on("click", ".dropdown-item", async function() {
    const api_type = $(this).attr("api_type")
    const data = (await get_by_id($(this).attr("api_source"), $(this).attr("api_id")))[api_type]

    const api_id = data["id"]
    const name = data["name"]
    const price = data["price"].toFixed(2)
    
    const $card = $("<div>", {
        "class": "card order-entry",
        "api_type": api_type,
        "api_id": api_id,
        "price": price
    })

    $("<div>", {
        text: `${name} - ${price}\u20AC`,
        "class": "card-header"
    }).appendTo(
        $card
    )

    const $card_ul = $("<ul>", {
        "class": "list-group list-group-flush",
    })

    $("<input>", {
        "type": "range",
        "class": `form-range order-range`,
        "min": "1",
        "max": "10",
        "value": "1",
        "name": `${api_type}_${api_id}` // to be remove for json request!
        
    }).appendTo(
        $("<li>", {
            "class": "list-group-item"
        })
    ).appendTo($card_ul)

    $("<li>", {
        text: `x1 ${price}\u20AC`,
        "class": "list-group-item order-info"
    }).appendTo($card_ul)
    $card_ul.appendTo($card)

    $(".dropdown").remove()
    
    $card.appendTo($("#order-container"))

    excluded[api_type].push(api_id)

    const [ $food_dropdown, $drink_dropdown] = create_dropdowns()
    $("#order-container").append($food_dropdown, $drink_dropdown)
})

$(document).on("input", ".order-range", function() {
    const $parent_ul = $(this).parent()
    
    const $order_range = $parent_ul.children("input.order-range")
    const $order_info = $parent_ul.children("li.order-info")
    const price = $parent_ul.parent().attr("price")
    
    const amount = parseInt($order_range.val())
    const total_price = (amount * parseFloat(price))

    const final_string = `x${amount} ${total_price.toFixed(2)}\u20AC`
    $order_info.text(final_string)
})

$(document).on("submit", "#order-form", function() {
    // TODO: I'm tired, going to sleep. cya tomorrow
})

$(function () {
    create_form()
})