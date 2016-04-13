#pragma once
#include <vector>
#include "IPosition.h"
#define EFFICIO_API __declspec(dllexport)

namespace Efficio {
	class EFFICIO_API Frame
	{
		std::vector<Efficio::Input::IPosition> positions;
	public:
		Frame();
		~Frame();
		std::vector<Efficio::Input::IPosition> getPositions() { return positions; }
		void AddPosition(Efficio::Input::IPosition position) { positions.push_back(position); }
	};
}