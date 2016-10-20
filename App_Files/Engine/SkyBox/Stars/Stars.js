module.exports = function(){
    var _azimuth = 0.5,
      _sunPosition = new THREE.Vector3(),
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

        _Shader.fragment().injectVars([
            "float Noise2d( in vec2 x )",
            "{",
                "float xhash = cos( x.x * 37.0 );",
                "float yhash = cos( x.y * 57.0 );",
                "return fract( 415.92653 * ( xhash + yhash ) );",
            "}",
            "float NoisyStarField( in vec2 vSamplePos, float fThreshhold )",
            "{",
                "float StarVal = Noise2d( vSamplePos );",
                "if ( StarVal >= fThreshhold )",
                    "StarVal = pow( (StarVal - fThreshhold)/(1.0 - fThreshhold), 6.0 );",
                "else",
                    "StarVal = 0.0;",
                "return StarVal;",
            "}",
            "float StableStarField( in vec2 vSamplePos, float fThreshhold )",
            "{",
                "float fractX = fract( vSamplePos.x );",
                "float fractY = fract( vSamplePos.y );",
                "vec2 floorSample = floor( vSamplePos );",  
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
            "// Sky Background Color",
            "vec3 vColor = vec3( 0.0, 0.0, 0.1) * fragCoord.y / iResolution.y;",

            "// Note: Choose fThreshhold in the range [0.99, 0.9999].",
            "// Higher values (i.e., closer to one) yield a sparser starfield.",
            "float StarFieldThreshhold = 0.99;",

            "// Stars with a slow crawl.",
            "float xRate = 0.01;",
            "float yRate = 0.0;",
            "vec2 vSamplePos = fragCoord.xy + vec2( xRate * float( iFrame ), yRate * float( iFrame ) );",
            "float StarVal = StableStarField( vSamplePos, StarFieldThreshhold );",
            "vColor += vec3( StarVal );",
            
            "fragColor = vec4(vColor, 1.0);",
        ]);

        _Shader.Uniform('skyPosition',_starMesh.position);
    
        _starMesh.visible = false;
    
        _Shader.side(THREE.BackSide).call();

        Stars.updateTime(_azimuth);
        _skyMesh = new THREE.Mesh(_geo,_Shader.shader());
    }

    Sun.updateTime = function(v){
        _azimuth = v;
        var theta = Math.PI * ( 1.0 - 0.5 );
        var phi = 2 * Math.PI * ( _azimuth - 0.5 );

        _starMesh.position.x = 400000 * Math.cos( phi );
        _starMesh.position.y = 400000 * Math.sin( phi ) * Math.sin( theta );
        _starMesh.position.z = 400000 * Math.sin( phi ) * Math.cos( theta );
        //console.log("phi ",phi,Math.sin(phi),"theta ",theta,Math.sin(theta),_starMesh.position.x,_starMesh.position.y,_starMesh.position.z);
        _Shader.loadedUniforms().skyPosition.value.copy(_starMesh.position);
        _Shader.Uniform('skyPosition',_starMesh.position);
    }
}