# Ignite RentX
Car rental API made with Node.js and TypeScript during Ignite NodeJS

## 🔨 Features
→ **Car Registration**

→ **Car Listing**

→ **Car Spec Registration**

→ **Car Listing**

## 🔌️ Requirement Analysis
### Car Registration
**RF**
- should be able to register a new car.
- should be able to list all car specs.
  
**RN**
- should not be able to register a car with an existent license place.
- should not be able to change a car's license plate.
- should not be able to register a new car in case the user is not an administrator.
- new cars should be always available.

### Car Listing
**RF**
- should be able to list all available cars.
- should be able to list all available cars by category.
- should be able to list all available cars by brand.
- should be able to list all available cars by name.

**RN**
- should be able to list cars even for an unlogged in user.

### Car Spec Registration
**RF**
- should be able to register a new car spec.
- should be able to list all car specs.
- should be able to list all car specs cars.

**RN**
- should not be able to register a new car spec relative to a unregistered car.
- should not be able to register an existing car spec in this car spec list.
- should not be able to register a new car spec in case the user is not an administrator.

### Car Image Registration
**RF**
- should be able to register a new car image.

**RNF**
- use multer to upload files.

**RN**
- should be able to register more than one image per car.
- should not be able to register a new car image in case the user is not an administrator.

### Car Rental Registration
**RF**
- should be able to register a new car rental.

**RN**
- should not be able to register a new car rental to a user with an active car rental.
- should not be able to register a new car rental for an already rented car.
- a car rent should have a maximum duration of 24 hours.

## 🚀 Techs & Tools
→ [**Docker**](https://docs.docker.com/)

→ [**Node.js**](https://nodejs.org)

→ [**TypeScript**](https://www.typescriptlang.org/)

→ [**Swagger UI**](https://swagger.io/tools/swagger-ui/)


## 💻 Local Setup
