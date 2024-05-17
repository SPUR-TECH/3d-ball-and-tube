document.addEventListener("DOMContentLoaded", function () {
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
		console.log(`Image loaded: ${imagesLoaded}/${frameCount}`);
		if (imagesLoaded === frameCount) {
			canvas.width = canvasWidth = images[0].width;
			canvas.height = canvasHeight = images[0].height;
			render();

			document.querySelectorAll("h1").forEach((h1) => {
				h1.style.display = "none";
			});

			document.body.style.overflow = "auto";
			document.getElementById("info-text").style.display = "block";
			document.getElementById("play-btn").style.display = "block";
			document.getElementById("fullscreen-btn").style.display = "block"; // Show fullscreen button
			console.log("All images loaded. Fullscreen button displayed.");

			gsap.fromTo(
				".ball-text",
				{
					opacity: 0,
					display: "none",
				},
				{
					opacity: 1,
					display: "block",
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
		context.clearRect(0, 0, canvasWidth, canvasHeight);
		context.drawImage(images[ball.frame], 0, 0);
	}

	document.getElementById("play-btn").addEventListener("click", function () {
		const scrollAmount = window.innerHeight / 20;
		smoothScrollDown(scrollAmount, 20);

		setTimeout(function () {
			gsap.to(ball, {
				frame: frameCount - 1,
				snap: "frame",
				ease: "none",
				duration: 5,
				onUpdate: render,
			});
		}, 1000);
	});

	function smoothScrollDown(scrollAmount, steps) {
		let i = 0;
		const scrollInterval = setInterval(function () {
			if (i < steps) {
				window.scrollBy(0, scrollAmount);
				i++;
			} else {
				clearInterval(scrollInterval);
			}
		}, 50);
	}

	document
		.getElementById("fullscreen-btn")
		.addEventListener("click", function () {
			if (document.fullscreenElement) {
				document.exitFullscreen();
			} else {
				document.documentElement.requestFullscreen().catch((err) => {
					console.log(
						`Error attempting to enable full-screen mode: ${err.message} (${err.name})`,
					);
				});
			}
		});
});
