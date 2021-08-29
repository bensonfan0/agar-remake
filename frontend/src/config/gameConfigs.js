/*
    configuration settings for game
*/
export const GAME_CONFIGS = {
    PLAYER_POPULATION : 1,
    BOT_POPULATION : 3,    
    PLAYER_ACCELERATION : 0.1,
    PLAYER_START_AREA : 2500, 
    FOOD_NUMBER : 50,
    FOOD_AREA : 200,
    MAX_VELOCITY_NUMERATOR : 100000, // higher is faster
    CONSUMABLE_RATIO : 5/3,
    MAX_AREA : 100000,
    AMOUNT_BOUNCE : 1.5,
    SOCKET_CONSTANTS : {
        GAME_UPDATE : 'update',
        JOIN_GAME : 'join',
        INPUT : 'input'
    },
    WINDOW_SIZE : {
        WIDTH : 1920,
        HEIGHT : 1040,
    }
}




