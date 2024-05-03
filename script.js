const canvas = document.querySelector(".canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const context = canvas.getContext("2d");
const frameCount = 220;

const currentFrame = (index) => `./img/ballzy/${(index + 1).toString()}.jpg`;

const images = [];
let ball = { frame: 0 };
let imagesLoaded = 0;

function checkImagesLoaded() {
	imagesLoaded++;
	if (imagesLoaded === frameCount) {
		// All images are loaded, show .ball-text element
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
	context.canvas.width = images[0].width;
	context.canvas.height = images[0].height;

	context.clearRect(0, 0, canvas.width, canvas.height);
	context.drawImage(images[ball.frame], 0, 0);
}
