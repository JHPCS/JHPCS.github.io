<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $name = $_POST["name"];
    $email = $_POST["email"];
    $message = $_POST["message"];

    // Set recipient email address
    $to = "jmawmaw711@gmail.com"; // Replace with your email address

    // Set email subject
    $subject = "Contact Form Submission from $name";

    // Build email message
    $email_message = "Name: $name\n";
    $email_message .= "Email: $email\n";
    $email_message .= "Message:\n$message";

    // Send email
    if (mail($to, $subject, $email_message)) {
        // Email sent successfully
        echo "Thank you for contacting us. We will get back to you soon.";
    } else {
        // Email sending failed
        echo "Sorry, there was an error sending your message.";
    }
} else {
    // If the form was not submitted, display an error message
    echo "Something went wrong. Please try again later.";
}
?>
