const form_data = {
    "food": {},
    "drink": {}
}

// FORM CREATOR - START
function get_dropdown_list_from(get_endpoint, get_type) {
    const $dropdown_list = $("<ul>", {
        "class": "dropdown-menu"
    })

    const endpoint = [get_endpoint, get_type].join('/')

    $.ajax({
        method: "GET",
        url: endpoint,
        dataType: "json",
        success: function (results) {
            for (const result of results[get_type]) {
                $("<li>").append($("<a>", {
                    text: result["name"],
                    "class": `dropdown-item ${get_type}`,
                    "href": "#",
                    "api_source": [get_endpoint, get_type].join('/'),
                    "api_type": get_type,
                    "api_id": result['id']
                })).appendTo($dropdown_list)
            }
        }
    })

    return $dropdown_list
}

function create_dropdown_from(api_endpoint, api_type, button_text) {
    const $dropdown_list = get_dropdown_list_from(api_endpoint, api_type)
    const $dropdown = $("<div>", {
        "class": `dropdown ${api_type}-dropdown`
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
    return [$food_dropdown, $drink_dropdown]
}

function create_form() {
    const $order_container = $("#order-container")
    const [$food_dropdown, $drink_dropdown] = create_dropdowns()
    $order_container.append($food_dropdown, $drink_dropdown)
}

function create_entry(api_type, api_id, name, price) {
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
    $card.insertBefore($(".food-dropdown"))

    form_data[api_type][api_id] = {
        "name": name,
        "price": price,
        "amount": "1"
    }

    sessionStorage.setItem("form_data", JSON.stringify(form_data))
}
// FORM CREATOR - END

function get_data_by_id(endpoint, id) {
    endpoint += `/${id}`

    return Promise.resolve($.ajax({
        method: "GET",
        url: endpoint,
        dataType: "json",
    }))
}

// ORDER HANDLER - START
$(document).on("click", ".dropdown-item", async function () {
    const api_type = $(this).attr("api_type")
    const data = (await get_data_by_id($(this).attr("api_source"), $(this).attr("api_id")))[api_type]

    const api_id = data["id"]
    const name = data["name"]
    const price = data["price"].toFixed(2)

    create_entry(api_type, api_id, name, price)

    $(this).remove()
})

$(document).on("input", ".order-range", function () {
    const $parent_ul = $(this).parent()

    const $order_info = $parent_ul.children("li.order-info")
    const price = $parent_ul.parent().attr("price")

    const amount = parseInt($(this).val())
    const total_price = (amount * parseFloat(price))

    const final_string = `x${amount} ${total_price.toFixed(2)}\u20AC`
    $order_info.text(final_string)
})

$(document).on("change", ".order-range", function () {
    const $tmp = $(this).parent().parent()
    const api_type = $tmp.attr("api_type")
    const api_id = $tmp.attr("api_id")

    form_data[api_type][api_id]["amount"] = $(this).val()
    sessionStorage.setItem("form_data", JSON.stringify(form_data))
})
// ORDER HANDLER - END

function clear_form_backup() {
    form_data['food'] = {}
    form_data['drink'] = {}
    sessionStorage.removeItem("form_data")
}

$(document).on("submit", "#order-form", function (form) {
    form.preventDefault()

    const $orders = $(".order-entry")
    const json_request = {
        "food": [],
        "drink": []
    }

    $orders.each(function () {
        json_request[$(this).attr("api_type")].push({
            "id": $(this).attr("api_id"),
            "amount": $(this).find("input.order-range").val()
        })
    })

    $.ajax({
        method: "POST",
        url: "/api/handle_order",
        data: JSON.stringify(json_request),
        contentType: "application/json; charset=utf-8",
        statusCode: {
            200: function () {
                const $order_container = $("#order-container")
                const [$food_dropdown, $drink_dropdown] = create_dropdowns()

                $order_container.empty()
                $order_container.append($food_dropdown, $drink_dropdown)

                clear_form_backup()
            },
            400: function () {
                $("#order-container").prepend(
                    $("<div>", {
                        text: "Bad Order! Try refreshing the page (don't worry, your order won't reset!)",
                        "class": "alert alert-danger",
                        "role": "alert"
                    })
                )
            }
        }
    })
})

const wait_for_element = function (selector, callback) {
    if (jQuery(selector).length) {
        callback(jQuery(selector));
    } else {
        setTimeout(function () {
            wait_for_element(selector, callback);
        }, 100);
    }
};

function restore_form() {
    const form_backup = JSON.parse(sessionStorage.getItem("form_data"))
    if (form_backup === null) return false

    for (const api_type of Object.keys(form_backup)) {
        for (const id of Object.keys(form_backup[api_type])) {
            create_entry(api_type, id, form_backup[api_type][id]["name"], form_backup[api_type][id]["price"])

            wait_for_element(`a.dropdown-item.food:contains('${form_backup[api_type][id]["name"]}')`, function (e) {
                e.eq(0).remove()
            })
        }
    }

    return true
}

$(window).on("load", function () {
    if (restore_form()) {
        const $div_restored = $("<div>", {
            text: "Restored previous form",
            "class": "alert alert-success",
            "role": "alert"
        })

        $div_restored.prependTo($("#order-container"))

        setTimeout(function () {
            $div_restored.fadeOut(400, function () {
                $div_restored.remove()
            })
        }, 1000)
    }
})

$(function () {
    create_form()
})