function calculate_area() {
    r = parseInt(jQuery('#x').val());
    jQuery('#p1').html("The circle's area is: " + (r * r * 22/7));
}

function setup() {
    jQuery('#calc').click(calculate_area);
}

jQuery(document).ready(setup);