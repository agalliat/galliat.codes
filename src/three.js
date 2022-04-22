import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

class App {
    constructor() {
        this.render = this.render.bind(this);
        this.onResize = this.onResize.bind(this);
    }

    setup() {
        // Create WebGL renderer
        const canvas = document.querySelector("#homeCanvas");
        console.log(canvas);
        const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true
        });
        renderer.setClearColor(0x000000, 0);
        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

        // Init perspective camera
        const camera = new THREE.PerspectiveCamera(
            75,
            canvas.clientWidth / canvas.clientHeight,
            0.1,
            1000
        );
        camera.position.z = 5;

        // Init Scene
        const scene = new THREE.Scene();
        const geometry = new THREE.SphereGeometry(0.2, 16, 16);

        for (let i = 0; i < 50; i++) {
            const material = new THREE.MeshLambertMaterial({
                color: (Math.random() * 0x1000000) | 0
            });
            const bubble = new THREE.Mesh(geometry, material);
            bubble.position.x = (-0.5 + Math.random()) * 5;
            bubble.position.y = (-0.5 + Math.random()) * 5;
            bubble.position.z = (-0.5 + Math.random()) * 5;
            scene.add(bubble);
        }

        // Setup lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(0, 10, 10);
        dirLight.target.position.set(-5, 0, 0);
        scene.add(dirLight);

        const controls = new OrbitControls(camera, renderer.domElement);

        controls.target.set(0, 0, 0);
        controls.update();
        this.controls = controls;
        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;
        this.render();
        window.addEventListener("resize", this.onResize, false);

        requestAnimationFrame(this.render);
        controls.addEventListener("change", this.render, false);
    }

    render() {
        const { renderer, scene, camera } = this;
        renderer.render(scene, camera);
    }

    loop = () => {
        this.render();
        requestAnimationFrame(this.loop);
    };

    onResize() {
        const { renderer, camera } = this;
        const canvas = renderer.domElement;
        const { width, height } = canvas.getBoundingClientRect();
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        this.render();
    }

    dispose() {
        const { scene, controls } = this;
        window.removeEventListener("resize", this.onResize, false);
        controls?.dispose();
        const children = [...scene.children];
        for (let obj of children) {
            obj.geometry.dispose();
            obj.material.dispose();
            scene.remove(obj);
        }
    }
}

const app = new App();
app.setup();
