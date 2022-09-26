
function get_dropdown_list_from(endpoint) {
    var $dropdown_list = $("<ul>", { "class": "dropdown-menu "})
    $.ajax({
        method: "GET",
        url: endpoint,
        dataType: "json",
        success: function(results) {
            var result_name = Object.keys(results)[0]
            for (const result of results[result_name]) {
                $("<li>").append($("<a>", {
                    text: result["name"],
                    "class": `dropdown-item ${result_name}`,
                    "href": "#",
                    "api_source": endpoint,
                    "api_type": result_name,
                    "api_id": result['id']
                })).appendTo($dropdown_list)
            }
        }
    })

    return $dropdown_list
}

function create_dropdown_from(endpoint, button_text) { 
    var $dropdown_list = get_dropdown_list_from(endpoint)
    var $dropdown = $("<div>", { 
        "class": `dropdown`
    })   
    var $dropdown_button = $("<button>", {
        text: button_text,
        "class": "btn btn-secondary dropdown-toggle",
        "type": "button",
        "data-bs-toggle": "dropdown",
        "aria-expanded": "false"
    })

    $dropdown.append($dropdown_button, $dropdown_list)

    return $dropdown
}

function create_form() {
    var $form_container = $("#order-container")

    var $food_dropdown = create_dropdown_from("/api/get_foods", "Add food")
    var $drink_dropdown = create_dropdown_from("/api/get_drinks", "Add drink")
    $form_container.append($food_dropdown, $drink_dropdown)
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
    var data = (await get_by_id($(this).attr("api_source"), $(this).attr("api_id")))[$(this).attr("api_type")]

    var name = data["name"]
    var price = data["price"].toFixed(2)
    
    var $card = $("<div>", {
        "class": "card"
    })

    $("<div>", {
        text: `${name} - ${price}\u20AC`,
        "class": "card-header"
    }).appendTo(
        $card
    )

    var $card_ul = $("<ul>", {
        "class": "list-group list-group-flush"
    })

    $("<input>", {
        "type": "range",
        "class": `form-range order-range`,
        "min": "1",
        "max": "10",
        "value": "1",
        "price": price
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

    $("<button>", {
        text: "Order",
        "type": "submit",
        "class": "btn btn-primary"
    }).appendTo($("form"))
})

$(document).on("input", ".order-range", function() {
    var $parent = $(this).parent()
    var $order_range = $parent.children("input.order-range")
    var $order_info = $parent.children("li.order-info")
    
    var amount = parseInt($order_range.val())
    var total_price = (amount * parseFloat($order_range.attr("price")))

    var final_string = `x${amount} ${total_price.toFixed(2)}\u20AC`
    $order_info.text(final_string)
})

$(function () {
    create_form()
})