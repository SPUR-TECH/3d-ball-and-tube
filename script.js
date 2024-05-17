// Ensure DOM content is loaded before executing script
document.addEventListener("DOMContentLoaded", function () {
	// Disable scrolling until all images are loaded
	document.body.style.overflow = "hidden";

	const canvas = document.querySelector(".canvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	const context = canvas.getContext("2d");
	const frameCount = 220;

	const currentFrame = (index) => `./img/ballzy/${(index + 1).toString()}.jpg`;

	const images = [];
	let ball = { frame: 0 };
	let imagesLoaded = 0;
	let canvasWidth, canvasHeight;

	function checkImagesLoaded() {
		imagesLoaded++;
		if (imagesLoaded === frameCount) {
			canvas.width = canvasWidth = images[0].width;
			canvas.height = canvasHeight = images[0].height;
			render(); // Render once all images are loaded

			// Hide the h1 elements if all images are loaded
			document.querySelectorAll("h1").forEach((h1) => {
				h1.style.display = "none";
			});

			// Re-enable scrolling
			document.body.style.overflow = "auto";

			// Show paragraph and button
			document.getElementById("info-text").style.display = "block";
			document.getElementById("play-btn").style.display = "block";

			// Add onComplete animation for the ".ball-text" element
			gsap.fromTo(
				".ball-text",
				{
					opacity: 0,
					display: "none", // Initially hide the element
				},
				{
					opacity: 1,
					display: "block", // Show the element
					scrollTrigger: {
						scrub: 1,
						start: "50%",
						end: "100%",
					},
					onComplete: () => {
						gsap.to(".ball-text", { opacity: 0 });
					},
				},
			);
		}
	}

	for (let i = 0; i < frameCount; i++) {
		const img = new Image();
		img.onload = checkImagesLoaded;
		img.src = currentFrame(i);
		images.push(img);
	}

	gsap.to(ball, {
		frame: frameCount - 1,
		snap: "frame",
		ease: "none",
		scrollTrigger: {
			scrub: 0.5,
			pin: "canvas",
			end: "500%",
		},
		onUpdate: render,
	});

	function render() {
		context.clearRect(0, 0, canvasWidth, canvasHeight); // Clear only necessary area
		context.drawImage(images[ball.frame], 0, 0);
	}

	// Add event listener to the button to play the animation
	document.getElementById("play-btn").addEventListener("click", function () {
		const scrollAmount = window.innerHeight / 20; // Adjust the smooth scroll amount as needed
		smoothScrollDown(scrollAmount, 20); // Smoothly scroll down

		// Delay the animation start to sync with scroll
		setTimeout(function () {
			gsap.to(ball, {
				frame: frameCount - 1,
				snap: "frame",
				ease: "none",
				duration: 5, // duration of the animation in seconds
				onUpdate: render,
			});
		}, 1000); // Adjust the delay as needed
	});

	// Function for smooth scroll down
	function smoothScrollDown(scrollAmount, steps) {
		let i = 0;
		const scrollInterval = setInterval(function () {
			if (i < steps) {
				window.scrollBy(0, scrollAmount);
				i++;
			} else {
				clearInterval(scrollInterval);
			}
		}, 50); // Adjust the scroll interval as needed
	}
});
