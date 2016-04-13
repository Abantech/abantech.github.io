#pragma once
#include "IPosition.h";

#define EFFICIO_CORE_API __declspec(dllexport)

namespace Efficio {
	namespace Input {
		namespace Human {
			namespace Hands {
				class EFFICIO_CORE_API ISingleHandPosition : public IPosition
				{
				public:
					ISingleHandPosition() {};
				};
			}
		}
	}
}