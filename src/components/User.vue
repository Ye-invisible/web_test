<template>
    <div class="avatar-frame">
        <img src="../assets/images/dog2.jpg" alt="Avatar" class="avatar-image" />
    </div>
</template>

<style>
.avatar-frame {
    width: 100px; /* Set the width of the frame */
    height: 100px; /* Set the height of the frame */
    border: 5px solid #fff; /* White border */
    border: transparent;
    border-radius: 50%; /* Make it circular */
    box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.2); /* Add shadow for depth */
    position: fixed; /* Make it fixed to the viewport */
    top: 20px; /* Adjust the vertical position */
    right: 20px; /* Adjust the horizontal position */
    overflow: hidden; /* Hide overflow */
    display: flex; /* Center the image */
    justify-content: center; /* Center the image horizontally */
    align-items: center; /* Center the image vertically */
}

.avatar-image {
    width: 100%; /* Make the image fill the frame */
    height: auto; /* Maintain aspect ratio */
    border-radius: 50%; /* Ensure the image is also circular */
}
</style>