#pragma once
#include "ISingleHandPosition.h"

namespace Efficio {
	class Pinch : public Input::Human::Hands::ISingleHandPosition
	{
	public:
		Pinch();
		~Pinch();
	};
}