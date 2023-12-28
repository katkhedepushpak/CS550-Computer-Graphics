#version 330 compatibility
// make this 120 for the mac:

uniform float   uKa, uKd, uKs;	 // coefficients of each type of lighting -- make sum to 1.0
uniform vec3    uColor;		 // object color
uniform vec3    uSpecularColor;	 // light color
uniform float   uShininess;	 // specular exponent

// ellipse-equation uniform variables -- these should be set every time Display( ) is called:

uniform float   uSc, uTc;
uniform float   uRs, uRt;

// in variables from the vertex shader and interpolated in the rasterizer:

in  vec3  vN;		   // normal vector
in  vec3  vL;		   // vector from point to light
in  vec3  vE;		   // vector from point to eye
in  vec2  vST;		   // (s,t) texture coordinates


void
main( )
{
	vec3 Normal = normalize(vN);
	vec3 Light  = normalize(vL);
	vec3 Eye    = normalize(vE);
	float s = vST.s;
	float t = vST.t;

	// determine the color using the ellipse equation:

	vec3 myColor = uColor;
	float ds = ( s - uSc ) / uRs;
	float dt = ( t - uTc ) / uRt;
	float d = ds*ds + dt*dt;
	if( d <= 1. )
	{
		myColor = vec3( 0, 1, 0);
	}

	// apply the per-fragmewnt lighting to myColor:

	vec3 ambient = uKa * myColor;

	float dd = max( dot(Normal,Light), 0. );       // only do diffuse if the light can see the point
	vec3 diffuse = uKd * dd * myColor;

	float sq = 0.;
	if( dot(Normal,Light) > 0. )	      // only do specular if the light can see the point
	{
		vec3 ref = normalize(  reflect( -Light, Normal )  );
		sq = pow( max( dot(Eye,ref),0. ), uShininess );
	}
	vec3 specular = uKs * sq * uSpecularColor;
	gl_FragColor = vec4( ambient + diffuse + specular,  1. );
}

