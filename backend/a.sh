#!/bin/bash

# -----------------------------
# MODULE: event-calendar-management
# -----------------------------

# DOMAIN - ENTITY
mv src/modules/event-calendar-management/domain/entity/calendar.entity.ts src/modules/event-calendar-management/domain/entity/calendar.entity.ts

# INTERFACE - CONTROLLER
mv src/modules/event-calendar-management/interface/controller/calendar.controller.ts src/modules/event-calendar-management/interface/controller/calendar.controller.ts

# INTERFACE - ROUTE
mv src/modules/event-calendar-management/interface/route/calendar.route.ts src/modules/event-calendar-management/interface/route/calendar.route.ts

# INFRASTRUCTURE - GATEWAY
mv src/modules/event-calendar-management/infrastructure/gateway/calendar.gateway.ts src/modules/event-calendar-management/infrastructure/gateway/calendar.gateway.ts

# INFRASTRUCTURE - MEMORY REPOSITORY
mv src/modules/event-calendar-management/infrastructure/repositories/memory-repository/calendar.repository.ts src/modules/event-calendar-management/infrastructure/repositories/memory-repository/calendar.repository.ts

# TESTS - ROUTES
mv src/modules/event-calendar-management/test/routes/calendar.route.spec.ts src/modules/event-calendar-management/test/routes/calendar.route.spec.ts

# TESTS - CONTROLLERS
mv src/modules/event-calendar-management/test/controllers/calendar.controller.spec.ts src/modules/event-calendar-management/test/controllers/calendar.controller.spec.ts

# TESTS - USECASES
mv src/modules/event-calendar-management/test/usecases/event/find-all.usecase.spec.ts src/modules/event-calendar-management/test/usecases/event/find-all.usecase.spec.ts
mv src/modules/event-calendar-management/test/usecases/event/create.usecase.spec.ts src/modules/event-calendar-management/test/usecases/event/create.usecase.spec.ts
mv src/modules/event-calendar-management/test/usecases/event/update.usecase.spec.ts src/modules/event-calendar-management/test/usecases/event/update.usecase.spec.ts
mv src/modules/event-calendar-management/test/usecases/event/delete.usecase.spec.ts src/modules/event-calendar-management/test/usecases/event/delete.usecase.spec.ts
mv src/modules/event-calendar-management/test/usecases/event/find.usecase.spec.ts src/modules/event-calendar-management/test/usecases/event/find.usecase.spec.ts

# TESTS - MEMORY REPOSITORY
mv src/modules/event-calendar-management/test/repositories/memory-repository/calendar.repository.spec.ts src/modules/event-calendar-management/test/repositories/memory-repository/calendar.repository.spec.ts

# TESTS - ENTITIES
mv src/modules/event-calendar-management/test/modules/entities/calendar.entity.spec.ts src/modules/event-calendar-management/test/modules/entities/calendar.entity.spec.ts

# APPLICATION - FACADE INTERFACE
mv src/modules/event-calendar-management/application/facade/interface/event-facade.interface.ts src/modules/event-calendar-management/application/facade/interface/calendar-facade.interface.ts

# APPLICATION - FACADE
mv src/modules/event-calendar-management/application/facade/facade/event.facade.ts src/modules/event-calendar-management/application/facade/facade/calendar.facade.ts

# APPLICATION - USECASES
mv src/modules/event-calendar-management/application/usecases/event/update.usecase.ts src/modules/event-calendar-management/application/usecases/event/update.usecase.ts
mv src/modules/event-calendar-management/application/usecases/event/find-all.usecase.ts src/modules/event-calendar-management/application/usecases/event/find-all.usecase.ts
mv src/modules/event-calendar-management/application/usecases/event/create.usecase.ts src/modules/event-calendar-management/application/usecases/event/create.usecase.ts
mv src/modules/event-calendar-management/application/usecases/event/delete.usecase.ts src/modules/event-calendar-management/application/usecases/event/delete.usecase.ts
mv src/modules/event-calendar-management/application/usecases/event/find.usecase.ts src/modules/event-calendar-management/application/usecases/event/find.usecase.ts

# APPLICATION - FACTORY
mv src/modules/event-calendar-management/application/factory/event-facade.factory.ts src/modules/event-calendar-management/application/factory/calendar-facade.factory.ts

# APPLICATION - DTOs
mv src/modules/event-calendar-management/application/dto/calendar-usecase.dto.ts src/modules/event-calendar-management/application/dto/calendar-usecase.dto.ts
mv src/modules/event-calendar-management/application/dto/calendar-facade.dto.ts src/modules/event-calendar-management/application/dto/calendar-facade.dto.ts
