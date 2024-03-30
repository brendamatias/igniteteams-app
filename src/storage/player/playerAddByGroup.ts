import AsyncStorage from "@react-native-async-storage/async-storage";
import { PLAYER_COLLECTION } from "@storage/config";
import { AppError } from "@utils/AppError";
import { PlayerStorageDTO } from "./PlayerStorageDTO";
import { playerGetByGroup } from "./playerGetByGroup";

export async function playerAddByGroup(player: PlayerStorageDTO, group: string) {
    try {
        const storedPlayers = await playerGetByGroup(group);
        const playerAlreadyExists = storedPlayers.filter(item => item.name === player.name);

        if (playerAlreadyExists.length > 0) {
            throw new AppError('Essa pessoa já está adicionada em um time.');
        }

        const storage =  JSON.stringify([...storedPlayers, player]);
        await AsyncStorage.setItem(`${PLAYER_COLLECTION}-${group}`, storage);
    } catch (error) {
        throw error;
    }
}