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

            "const float pi = 3.141592653589793238462643383279502884197169;",

            "varying vec2 vUv;",
          // Return random noise in the range [0.0, 1.0], as a function of x.
            "float Noise2d( in vec2 x )",
            "{",
                "float xhash = cos( x.x * 37.0 / pi );",
                "float yhash = cos( x.y * 57.0 / pi );",
                "return fract( 415.92653 * ( xhash + yhash ) );",
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
            "vec3 vColor = vec3( 0.0, 0.0, 0.1) * 0.4 / vUv.y;",

            // Note: Choose fThreshhold in the range [0.99, 0.9999]
            // Higher values (i.e., closer to one) yield a sparser starfield
            "float StarFieldThreshhold = 0.994;",

            "float xRate = -0.001;",
            "float yRate = -0.001;",
            "vec2 vSamplePos = gl_FragCoord.xy + vec2(xRate * vWorldPosition.x, yRate * vWorldPosition.y);",
            "float StarVal = StableStarField( vSamplePos, StarFieldThreshhold );",
            "float nightAlpha = ((skyPosition.y/450000.0) < 0.01 ? clamp((-1.0*((skyPosition.y/450000.0)*100.0)), 0.0, 1.0) : (skyPosition.y/450000.0 < 0.01 ? 1.0 : 0.0));",
            "vColor += vec3( StarVal );",
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
        _azimuth = v;
        var theta = Math.PI * ( -1.0 - 0.5 );
        var phi = 2 * Math.PI * ( _azimuth - 0.5 );

        _starMesh.position.x = 400000 * Math.cos( phi );
        _starMesh.position.y = 400000 * Math.sin( phi ) * Math.sin( theta );
        _starMesh.position.z = 400000 * Math.sin( phi ) * Math.cos( theta );
        //console.log("phi ",phi,Math.sin(phi),"theta ",theta,Math.sin(theta),_starMesh.position.x,_starMesh.position.y,_starMesh.position.z);
        _Shader.loadedUniforms().skyPosition.value.copy(_starMesh.position);
        _Shader.Uniform('skyPosition',_starMesh.position);
      console.log(_Shader.loadedUniforms().position,_Shader.loadedUniforms().modelMatrix)
    }

    return Stars;
}
