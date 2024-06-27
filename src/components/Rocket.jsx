import React, { useEffect, useRef } from 'react';

const Rocketry = () => {
  const canvasRef = useRef();

  useEffect(() => {
    let object;
    let scene;

    // Load external JavaScript resources
    const loadScripts = async () => {
      const scripts = [
        'https://codepen.io/steveg3003/pen/zBVakw.js',
        'https://unpkg.com/three@0.117.1/build/three.min.js',
        'https://unpkg.com/three@0.117.1/examples/js/loaders/OBJLoader.js',
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.3.1/gsap.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.3.1/ScrollTrigger.min.js',
        'https://s3-us-west-2.amazonaws.com/s.cdpn.io/16327/DrawSVGPlugin3.min.js'
      ];
      for (const src of scripts) {
        await new Promise(resolve => {
          const script = document.createElement('script');
          script.src = src;
          script.onload = resolve;
          document.body.appendChild(script);
        });
      }
    };

    class Scene {
      constructor(model) {
        this.views = [
          { bottom: 0, height: 1 },
          { bottom: 0, height: 0 }
        ];

        this.renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true
        });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setPixelRatio(window.devicePixelRatio);

        canvasRef.current.appendChild(this.renderer.domElement);

        this.scene = new THREE.Scene();

        this.views.forEach(view => {
          const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
          camera.position.set(0, 0, 180);
          camera.layers.disableAll();
          camera.layers.enable(this.views.indexOf(view));
          view.camera = camera;
          camera.lookAt(new THREE.Vector3(0, 5, 0));
        });

        this.light = new THREE.PointLight(0xffffff, 0.75);
        this.light.position.set(70, -20, 150);
        this.scene.add(this.light);

        this.softLight = new THREE.AmbientLight(0xffffff, 1.5);
        this.scene.add(this.softLight);

        const edges = new THREE.EdgesGeometry(model.children[0].geometry);
        const line = new THREE.LineSegments(edges);
        line.material.depthTest = false;
        line.material.opacity = 0.5;
        line.material.transparent = true;
        line.position.set(0.5, 0.2, -1);

        this.modelGroup = new THREE.Group();
        model.layers.set(0);
        line.layers.set(1);

        this.modelGroup.add(model);
        this.modelGroup.add(line);
        this.scene.add(this.modelGroup);

        this.onResize();
        window.addEventListener('resize', this.onResize);
      }

      render = () => {
        this.views.forEach(view => {
          const camera = view.camera;
          const bottom = Math.floor(this.h * view.bottom);
          const height = Math.floor(this.h * view.height);

          this.renderer.setViewport(0, 0, this.w, this.h);
          this.renderer.setScissor(0, bottom, this.w, height);
          this.renderer.setScissorTest(true);

          camera.aspect = this.w / this.h;
          this.renderer.render(this.scene, camera);
        });
      }

      onResize = () => {
        this.w = window.innerWidth;
        this.h = window.innerHeight;

        this.views.forEach(view => {
          const camera = view.camera;
          camera.aspect = this.w / this.h;
          const camZ = (screen.width - (this.w * 1)) / 3;
          camera.position.z = camZ < 180 ? 180 : camZ;
          camera.updateProjectionMatrix();
        });

        this.renderer.setSize(this.w, this.h);
        this.render();
      }
    }

    const loadModel = () => {
      const onModelLoaded = () => {
        object.traverse(child => {
          const mat = new THREE.MeshPhongMaterial({ color: 0x171511, specular: 0xD0CBC7, shininess: 5, flatShading: true });
          child.material = mat;
        });

        setupAnimation(object);
      };

      const manager = new THREE.LoadingManager(onModelLoaded);
      manager.onProgress = (item, loaded, total) => console.log(item, loaded, total);

      const loader = new THREE.OBJLoader(manager);
      loader.load('https://assets.codepen.io/557388/1405+Plane_1.obj', obj => {
        object = obj;
      });
    };

    const setupAnimation = model => {
      scene = new Scene(model);
      const plane = scene.modelGroup;

      gsap.fromTo('canvas', { x: '50%', autoAlpha: 0 }, { duration: 1, x: '0%', autoAlpha: 1 });
      gsap.to('.loading', { autoAlpha: 0 });
      gsap.to('.scroll-cta', { opacity: 1 });
      gsap.set('svg', { autoAlpha: 1 });

      const tau = Math.PI * 2;
      gsap.set(plane.rotation, { y: tau * -0.25 });
      gsap.set(plane.position, { x: 80, y: -32, z: -60 });

      scene.render();

      const sectionDuration = 1;
      gsap.fromTo(scene.views[1], { height: 1, bottom: 0 }, {
        height: 0, bottom: 1, ease: 'none',
        scrollTrigger: {
          trigger: '.blueprint',
          scrub: true,
          start: 'bottom bottom',
          end: 'bottom top'
        }
      });

      gsap.fromTo(scene.views[1], { height: 0, bottom: 0 }, {
        height: 1, bottom: 0, ease: 'none',
        scrollTrigger: {
          trigger: '.blueprint',
          scrub: true,
          start: 'top bottom',
          end: 'top top'
        }
      });

      gsap.to('.ground', {
        y: '30%',
        scrollTrigger: {
          trigger: '.ground-container',
          scrub: true,
          start: 'top bottom',
          end: 'bottom top'
        }
      });

      gsap.from('.clouds', {
        y: '25%',
        scrollTrigger: {
          trigger: '.ground-container',
          scrub: true,
          start: 'top bottom',
          end: 'bottom top'
        }
      });

      const tl = gsap.timeline({
        onUpdate: scene.render,
        scrollTrigger: {
          trigger: '.content',
          scrub: true,
          start: 'top top',
          end: 'bottom bottom'
        },
        defaults: { duration: sectionDuration, ease: 'power2.inOut' }
      });

      let delay = 0;
      tl.to('.scroll-cta', { duration: 0.25, opacity: 0 }, delay);
      tl.to(plane.position, { x: -10, ease: 'power1.in' }, delay);

      delay += sectionDuration;
      tl.to(plane.rotation, { x: tau * 0.25, y: 0, z: -tau * 0.05, ease: 'power1.inOut' }, delay);
      tl.to(plane.position, { x: -40, y: 0, z: -60, ease: 'power1.inOut' }, delay);

      delay += sectionDuration;
      tl.to(plane.rotation, { x: tau * 0.25, y: 0, z: tau * 0.05, ease: 'power3.inOut' }, delay);
      tl.to(plane.position, { x: 40, y: 0, z: -60, ease: 'power2.inOut' }, delay);

      delay += sectionDuration;
      tl.to(plane.rotation, { x: tau * 0.2, y: 0, z: -tau * 0.1, ease: 'power3.inOut' }, delay);
      tl.to(plane.position, { x: -40, y: 0, z: -30, ease: 'power2.inOut' }, delay);

      delay += sectionDuration;
      tl.to(plane.rotation, { x: 0, z: 0, y: tau * 0.25 }, delay);
      tl.to(plane.position, { x: 0, y: -10, z: 50 }, delay);

      delay += sectionDuration * 2;
      tl.to(plane.rotation, { x: tau * 0.25, y: tau * 0.5, z: 0, ease: 'power4.inOut' }, delay);
      tl.to(plane.position, { z: 30, ease: 'power4.inOut' }, delay);

      delay += sectionDuration;
      tl.to(plane.rotation, { x: tau * 0.25, y: tau * 0.5, z: 0, ease: 'power4.inOut' }, delay);
      tl.to(plane.position, { z: 60, x: 30, ease: 'power4.inOut' }, delay);

      delay += sectionDuration;
      tl.to(plane.rotation, { x: tau * 0.35, y: tau * 0.75, z: tau * 0.6, ease: 'power4.inOut' }, delay);
      tl.to(plane.position, { z: 100, x: 20, y: 0, ease: 'power4.inOut' }, delay);

      delay += sectionDuration;
      tl.to(plane.rotation, { x: tau * 0.15, y: tau * 0.85, z: -tau * 0, ease: 'power1.in' }, delay);
      tl.to(plane.position, { z: -150, x: 0, y: 0, ease: 'power1.inOut' }, delay);

      delay += sectionDuration;
      tl.to(plane.rotation, { duration: sectionDuration, x: -tau * 0.05, y: tau, z: -tau * 0.1, ease: 'none' }, delay);
      tl.to(plane.position, { duration: sectionDuration, x: 0, y: 30, z: 320, ease: 'power1.in' }, delay);
      tl.to(scene.light.position, { duration: sectionDuration, x: 0, y: 0, z: 0 }, delay);
    };

    loadScripts().then(loadModel);

    return () => {
      window.removeEventListener('resize', scene?.onResize);
    };
  }, []);

  return (
    <div ref={canvasRef}></div>
  );
};

export default Rocketry;
