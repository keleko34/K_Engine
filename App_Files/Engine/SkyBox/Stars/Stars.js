module.exports = function(){
    var _azimuth = 0.5,
        _Shader = null,
        _geo = new THREE.SphereBufferGeometry( 450000, 32, 15),
        _skyMesh = {},
        _logged = false,
        _starMesh = new THREE.Mesh(
                      new THREE.SphereBufferGeometry( 0, 0, 0 ),
                      new THREE.MeshBasicMaterial( { color: 0xffffff } )
                  );

    function Stars(){
        if(!_Shader){
            _Shader = Engine.CreateShader();
        }

        _Shader.fragment().clearInjects();

        _Shader.updateUniforms()
        .fragment().injectVars([
            "uniform vec3 skyPosition;",

          "float Hash( float n ){",
            "return fract( (1.0 + sin(n)) * 415.92653);",
          "}",
          "float Noise3d( vec3 x ){",
              "float xhash = Hash(floor(400.0 * x.x) * 37.0);",
              "float yhash = Hash(floor(400.0*x.y) * 57.0);",
              "float zhash = Hash(floor(400.0*x.z) * 67.0);",
              "return fract(xhash + yhash + zhash);",
          "}",

          // Return random noise in the range [0.0, 1.0], as a function of x.
            "float Noise2d( in vec2 x )",
            "{",
                "float xhash = Hash(floor((400.0 * x.x * (pi * 2.0))) * 37.0);",
                "float yhash = Hash(floor((400.0*x.y * (pi * 2.0))) * 57.0);",
                "return fract(xhash + yhash);",
            "}",
          // Convert Noise2d() into a "star field" by stomping everthing below fThreshhold to zero.
            "float NoisyStarField( in vec2 vSamplePos, float fThreshhold )",
            "{",
                "float StarVal = Noise2d( vSamplePos );",
                "if ( StarVal >= fThreshhold )",
                    "StarVal = pow( (StarVal - fThreshhold)/(1.0 - fThreshhold), 6.0 );",
                "else",
                    "StarVal = 0.0;",
                "return StarVal;",
            "}",
          // Stabilize NoisyStarField() by only sampling at integer values.
            "float StableStarField( in vec2 vSamplePos, float fThreshhold )",
            "{",

            // Linear interpolation between four samples.
            // Note: This approach has some visual artifacts.
            // There must be a better way to "anti alias" the star field.
                "float fractX = fract( vSamplePos.x );",
                "float fractY = fract( vSamplePos.y );",
                "vec2 floorSample = vSamplePos;",
                "float v1 = NoisyStarField( floorSample, fThreshhold );",
                "float v2 = NoisyStarField( floorSample + vec2( 0.0, 1.0 ), fThreshhold );",
                "float v3 = NoisyStarField( floorSample + vec2( 1.0, 0.0 ), fThreshhold );",
                "float v4 = NoisyStarField( floorSample + vec2( 1.0, 1.0 ), fThreshhold );",

                "float StarVal =   v1 * ( 1.0 - fractX ) * ( 1.0 - fractY )",
                                "+ v2 * ( 1.0 - fractX ) * fractY",
                                "+ v3 * fractX * ( 1.0 - fractY )",
                                "+ v4 * fractX * fractY;",
	            "return StarVal;",
            "}"
        ]);

        _Shader.fragment().injectRules([
            // Sky Background Color
            "vec3 vColor = vec3( 0.0, 0.0, 0.1) * (1.2 - vUv.y);",
            "vec3 sky_norm = normalize(skyPosition);",
            // Note: Choose fThreshhold in the range [0.99, 0.9999]
            // Higher values (i.e., closer to one) yield a sparser starfield
            "float threshold = 0.9997;",

            "float nightAlpha = ((skyPosition.y/450000.0) < 0.01 ? clamp((-1.0*((skyPosition.y/450000.0)*100.0)), 0.0, 1.0) : (skyPosition.y/450000.0 < 0.01 ? 1.0 : 0.0));",

            //"float stars = StableStarField(vUv,StarFieldThreshhold);",

            //"vColor += vec3( stars );",
            //"float xRate = -0.001;",
            //"float yRate = -0.001;",
            //"vec3 vSamplePos = gl_FragCoord.xyz + vec3(xRate * vWorldPosition.x, yRate * vWorldPosition.y,vWorldPosition.z);",
            //"float StarVal = StableStarField( vSamplePos, StarFieldThreshhold );",
            //"float nightAlpha = ((skyPosition.y/450000.0) < 0.01 ? clamp((-1.0*((skyPosition.y/450000.0)*100.0)), 0.0, 1.0) : (skyPosition.y/450000.0 < 0.01 ? 1.0 : 0.0));",
            //"vColor += vec3( StarVal );",
            "float star_intensity = Noise2d(vUv);",
            "if (star_intensity >= threshold){",
                "star_intensity = 1.0;",

                "vColor += vec3(star_intensity);",
            "}",

            "gl_FragColor.rgb = vColor;",
            "gl_FragColor.a = nightAlpha;"
        ]);

        _Shader.Uniform('skyPosition',_starMesh.position);
    
        _starMesh.visible = false;
    
        _Shader.side(THREE.BackSide).call();

        Stars.updateTime(_azimuth);
        _skyMesh = new THREE.Mesh(_geo,_Shader.shader());
    }

    Stars.sky = function(){
      return _skyMesh;
    }

    Stars.mesh = function(){
      return _starMesh;
    }

    Stars.isNight = function(){
      return (_starMesh.position.y <= 0);
    }

    Stars.time = function(){
      return _azimuth;
    }

    Stars.updateTime = function(v){
        //console.log(v);
        _azimuth = v;
        var theta = Math.PI * ( -1.0 - 0.5 );
        var phi = 2 * Math.PI * ( _azimuth - 0.5 );

        _starMesh.position.x = 400000 * Math.cos( phi );
        _starMesh.position.y = 400000 * Math.sin( phi ) * Math.sin( theta );
        _starMesh.position.z = 400000 * Math.sin( phi ) * Math.cos( theta );
        //console.log("phi ",phi,Math.sin(phi),"theta ",theta,Math.sin(theta),_starMesh.position.x,_starMesh.position.y,_starMesh.position.z);
        _Shader.loadedUniforms().skyPosition.value.copy(_starMesh.position);
      console.log(_starMesh.position);
        _Shader.Uniform('skyPosition',_starMesh.position);
    }

    return Stars;
}
