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
                    "api_id": result['id']
                })).appendTo($dropdown_list)
            }
        }
    })

    return $dropdown_list
}

function create_dropdown_from(endpoint, button_text) {
    var $dropdown = $("<div>", { "class": "dropdown" })
    var $dropdown_button = $("<button>", {
        text: button_text,
        "class": "btn btn-secondary dropdown-toggle",
        "type": "button",
        "data-bs-toggle": "dropdown",
        "aria-expanded": "false"
    })
    
    var $dropdown_list = get_dropdown_list_from(endpoint)
    $dropdown.append($dropdown_button, $dropdown_list)

    return $dropdown
}

// Fetches available pieces and initializes form when the document is ready
function create_form() {
    var $form_container = $("#form-container")

    var $food_dropdown = create_dropdown_from("/api/get_foods", "Add food")
    var $drink_dropdown = create_dropdown_from("/api/get_drinks", "Add drink")
    $form_container.append($food_dropdown, $drink_dropdown)
}

$(function () {
    create_form()
})

$(document).on("click", ".dropdown-item", function(element) {
    console.log(element.target)
})