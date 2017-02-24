module.exports = function(){
  var _azimuth = 0.5,
      _Shader = null,
      _geo = new THREE.SphereBufferGeometry( 450000, 32, 15),
      _skyMesh = {},
      _logged = false,
      _sunMesh = new THREE.Mesh(
					new THREE.SphereBufferGeometry( 0, 0, 0 ),
					new THREE.MeshBasicMaterial( { color: 0xffffff } )
				);

  function Sun(){
    if(!_Shader){
      _Shader = Engine.CreateShader();
    }

    _Shader.fragment().clearInjects();

    _Shader.updateUniforms()
    .fragment().injectVars([
      "uniform vec3 sunPosition;",
      "const float luminance = 1.0;",
      "const float turbidity = 8.0;",
      "const float reileigh = 2.0;",
      "const float mieCoefficient = 0.005;",
      "const float mieDirectionalG = 0.8;",
      "varying vec2 vUv;",

      "vec3 cameraPos = vec3(0.0, 0.0, 0.0);",

      "const float e = 2.71828182845904523536028747135266249775724709369995957;",
      "const float pi = 3.141592653589793238462643383279502884197169;",

      "const float pn = 0.035;",

      "const vec3 lambda = vec3(680E-9, 550E-9, 450E-9);",

      "const vec3 K = vec3(0.686, 0.678, 0.666);",
      "const float v = 4.0;",

      "const float rayleighZenithLength = 8.4E3;",
      "const float mieZenithLength = 1.25E3;",
      "const vec3 up = vec3(0.0, 1.0, 0.0);",

      "const float EE = 1000.0;",
      "const float sunAngularDiameterCos = 0.999956676946448443553574619906976478926848692873900859324;",

      "const float cutoffAngle = pi/1.95;",
      "const float steepness = 1.5;",


      "vec3 totalRayleigh(vec3 lambda)",
      "{",
          "return (8.0 * pow(abs(pi), 3.0) * pow(abs(pow(1.0003, 2.0) - 1.0), 2.0) * (6.0 + 3.0 * pn)) / (3.0 * 2.545E25 * pow(abs(vec3(680E-9, 550E-9, 450E-9)), vec3(4.0)) * (6.0 - 7.0 * 0.035));",
      "}",

      "vec3 simplifiedRayleigh()",
      "{",
          "return 0.0005 / vec3(94, 40, 18);",
      "}",

      "float rayleighPhase(float cosTheta)",
      "{	 ",
          "return (3.0 / (16.0*pi)) * (1.0 + pow(abs(cosTheta), 2.0));",
      "}",

      "vec3 totalMie(vec3 lambda, vec3 K, float T)",
      "{",
          "float c = (0.2 * T ) * 10E-18;",
          "return 0.434 * c * pi * pow(abs((2.0 * pi) / lambda), vec3(v - 2.0)) * K;",
      "}",

      "float hgPhase(float cosTheta, float g)",
      "{",
          "return (1.0 / (4.0*pi)) * ((1.0 - pow(abs(g), 2.0)) / pow(abs(1.0 - 2.0*g*cosTheta + pow(abs(g), 2.0)), 1.5));",
      "}",

      "float sunIntensity(float zenithAngleCos)",
      "{",
          "return EE * max(0.0, 1.0 - pow(abs(e), -((cutoffAngle - acos(zenithAngleCos))/steepness)));",
      "}",

      "float A = 0.15;",
      "float B = 0.50;",
      "float C = 0.10;",
      "float D = 0.20;",
      "float E = 0.02;",
      "float F = 0.30;",
      "float W = 1000.0;",

      "vec3 Uncharted2Tonemap(vec3 x)",
      "{",
         "return ((x*(A*x+C*B)+D*E)/(x*(A*x+B)+D*F))-E/F;",
      "}"
    ]);

    _Shader.fragment().injectRules([
      "float sunfade = 1.0-clamp(1.0-exp((sunPosition.y/450000.0)),0.0,1.0);",

			"float reileighCoefficient = reileigh - (1.0* (1.0-sunfade));",

			"vec3 sunDirection = normalize(sunPosition);",

			"float sunE = sunIntensity(dot(sunDirection, up));",

			"vec3 betaR = simplifiedRayleigh() * reileighCoefficient;",

			"vec3 betaM = totalMie(lambda, K, turbidity) * mieCoefficient;",

			"float zenithAngle = acos(max(0.0, dot(up, normalize(vWorldPosition - cameraPos))));",
			"float sR = rayleighZenithLength / (cos(zenithAngle) + 0.15 * pow(abs(93.885 - ((zenithAngle * 180.0) / pi)), -1.253));",
			"float sM = mieZenithLength / (cos(zenithAngle) + 0.15 * pow(abs(93.885 - ((zenithAngle * 180.0) / pi)), -1.253));",

			"vec3 Fex = exp(-(betaR * sR + betaM * sM));",

			"float cosTheta = dot(normalize(vWorldPosition - cameraPos), sunDirection);",

			"float rPhase = rayleighPhase(cosTheta*0.5+0.5);",
			"vec3 betaRTheta = betaR * rPhase;",

			"float mPhase = hgPhase(cosTheta, mieDirectionalG);",
			"vec3 betaMTheta = betaM * mPhase;",


			"vec3 Lin = pow(abs(sunE * ((betaRTheta + betaMTheta) / (betaR + betaM)) * (1.0 - Fex)),vec3(1.5));",
			"Lin *= mix(vec3(1.0),pow(abs(sunE * ((betaRTheta + betaMTheta) / (betaR + betaM)) * Fex),vec3(1.0/2.0)),clamp(pow(abs(1.0-dot(up, sunDirection)),5.0),0.0,1.0));",

			//nightsky
			"vec3 direction = normalize(vWorldPosition - cameraPos);",
			"float theta = acos(direction.y);", // elevation --> y-axis, [-pi/2, pi/2]
			"float phi = atan(direction.z, direction.x);", // azimuth --> x-axis [-pi/2, pi/2]",
			"vec2 uv = vec2(phi, theta) / vec2(2.0*pi, pi) + vec2(0.5, 0.0);",

			"vec3 L0 = vec3(0.1) * Fex;",

			"float sundisk = smoothstep(sunAngularDiameterCos,sunAngularDiameterCos+0.00002,cosTheta);",
			"L0 += (sunE * 19000.0 * Fex)*sundisk;",


			"vec3 whiteScale = 1.0/Uncharted2Tonemap(vec3(W));",

			"vec3 texColor = (Lin+L0);   ",
			"texColor *= 0.04 ;",
			"texColor += vec3(0.0,0.001,0.0025)*0.3;",

			"float g_fMaxLuminance = 1.0;",
			"float fLumScaled = 0.1 / luminance;     ",
			"float fLumCompressed = (fLumScaled * (1.0 + (fLumScaled / (g_fMaxLuminance * g_fMaxLuminance)))) / (1.0 + fLumScaled); ",

			"float ExposureBias = fLumCompressed;",

			"vec3 curr = Uncharted2Tonemap((log2(2.0/pow(abs(luminance),4.0)))*texColor);",
			"vec3 color = curr*whiteScale;",

			"vec3 retColor = pow(abs(color),vec3(1.0/(1.2+(1.2*sunfade))));",
			 "gl_FragColor.rgb = retColor;",

			"gl_FragColor.a = 1.0;"
    ]);
    
    _Shader.Uniform('sunPosition',_sunMesh.position);
    
    _sunMesh.visible = false;
    
    _Shader.side(THREE.BackSide).call();
    Sun.updateTime(_azimuth);
    _skyMesh = new THREE.Mesh(_geo,_Shader.shader());
  }

  Sun.sky = function(){
    return _skyMesh;
  }

  Sun.mesh = function(){
    return _sunMesh;
  }
  
  Sun.isNight = function(){
    return (_sunMesh.position.y <= 0);
  }
  
  Sun.time = function(){
    return _azimuth;
  }
  
  Sun.updateTime = function(v){
    _azimuth = v;
    var theta = Math.PI * ( 1.0 - 0.5 );
    var phi = 2 * Math.PI * ( _azimuth - 0.5 );

    _sunMesh.position.x = 400000 * Math.cos( phi );
    _sunMesh.position.y = 400000 * Math.sin( phi ) * Math.sin( theta );
    _sunMesh.position.z = 400000 * Math.sin( phi ) * Math.cos( theta );
    //console.log("phi ",phi,Math.sin(phi),"theta ",theta,Math.sin(theta),_sunMesh.position.x,_sunMesh.position.y,_sunMesh.position.z);
    _Shader.loadedUniforms().sunPosition.value.copy(_sunMesh.position);
    _Shader.Uniform('sunPosition',_sunMesh.position);
  }

  return Sun;
}
