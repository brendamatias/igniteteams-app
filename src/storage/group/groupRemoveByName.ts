import AsyncStorage from "@react-native-async-storage/async-storage";
import { GROUP_COLLECTION, PLAYER_COLLECTION } from "@storage/config";
import { groupsGetAll } from "./groupsGetAll";

export async function groupRemoveByName(group: string) {
    try {
        const storedGroups = await groupsGetAll();
        const filtered = storedGroups.filter(item => item !== group);
        const groups = JSON.stringify(filtered);

        await AsyncStorage.setItem(GROUP_COLLECTION, groups);
        await AsyncStorage.removeItem(`${PLAYER_COLLECTION}-${group}`);
    } catch (error) {
        throw error;
    }
}