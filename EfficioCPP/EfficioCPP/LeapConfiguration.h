#pragma once

namespace Efficio {
	namespace Devices {
		namespace LeapMotion {
			class LeapConfiguration
			{
				int a;
			public:
				LeapConfiguration();
				~LeapConfiguration();
				void setA(int b) { a = b; }
				int getA() { return a; }
			};
		}
	}
}