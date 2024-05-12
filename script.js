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
});
