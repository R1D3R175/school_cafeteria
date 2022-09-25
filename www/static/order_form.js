// Fetches available pieces and initializes form
// when the document is ready
function create_form() {
    var $form_container = $("#form-container")
    var $dropdown = $("<div>", { "class": "container" })
    var $dropdown_button = $("<button>", {
        text: "Add a piece",
        "class": "btn btn-secondary dropdown-toggle",
        "type": "button",
        "data-bs-toggle": "dropdown",
        "aria-expanded": "false",
    })

    $dropdown_button.appendTo($dropdown)

    $form_container.append($dropdown)
}

$(function () {
    create_form()
})