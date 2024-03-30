import { Header } from '@components/Header';
import { Container, Form, HeaderList, NumberOfPlayers } from './styles';
import { Highlight } from '@components/Highlight';
import { ButtonIcon } from '@components/ButtonIcon';
import { Input } from '@components/Input';
import { Filter } from '@components/Filter';
import { Alert, FlatList, TextInput } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { PlayerCard } from '@components/PlayerCard';
import { ListEmpty } from '@components/ListEmpty';
import { Button } from '@components/Button';
import { useNavigation, useRoute } from '@react-navigation/native';
import { playerAddByGroup } from '@storage/player/playerAddByGroup';
import { AppError } from '@utils/AppError';
import { PlayerStorageDTO } from '@storage/player/PlayerStorageDTO';
import { playerGetByGroupAndTeam } from '@storage/player/playerGetByGroupAndTeam';
import { playerRemoveByGroup } from '@storage/player/playerRemoveByGroup';
import { groupRemoveByName } from '@storage/group/groupRemoveByName';
import { Loading } from '@components/Loading';

type RouteParams = {
  group: string;
}

export default function Players() {
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState('Time A');
  const [player, setPlayer] = useState('');
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);

  const route = useRoute();
  const navigation = useNavigation();
  const newPlayerRef = useRef<TextInput>(null);
  const { group } = route.params as RouteParams;

  async function handleAddPlayer() {
    const newPlayer = {
      name: player,
      team,
    }

    try {
      if (player.trim().length === 0) {
        return Alert.alert('Nova pessoa', 'Informe o nome da pessoa.');
      }

      await playerAddByGroup(newPlayer, group);

      newPlayerRef.current?.blur();

      setPlayer('');
      fetchPlayers();
    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert('Nova pessoa', error.message);
      } else {
        Alert.alert('Nova pessoa', 'Não foi possível adicionar o player.');
        console.log(error);
      }
    }
  }

  async function handlePlayerRemove(name: string) {
    try {
      await playerRemoveByGroup(name, group);
      fetchPlayers();
    } catch (error) {
      console.log(error);
      Alert.alert('Pessoas', 'Não foi possível remover a pessoa.');
    }
  }

  async function groupRemove() {
    try {
      await groupRemoveByName(group);

      navigation.navigate('groups');
    } catch (error) {
      console.log(error);
      Alert.alert('Grupos', 'Não foi possível remover o grupo.');
    }
  }

  async function handleGroupRemove() {
    Alert.alert(
      'Remover',
      'Deseja remover o grupo?',
      [
        { text: 'Não', style: 'cancel' },
        { text: 'Sim', onPress: () => groupRemove() },
      ]
    );
  }

  async function fetchPlayers() {
    setLoading(true);

    try {
      const data = await playerGetByGroupAndTeam(group, team);

      setPlayers(data);
    } catch (error) {
      console.log(error);
      Alert.alert('Pessoas', 'Não foi possível carregar as pessoas do time selecionado');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPlayers();
  }, [team]);

  return (
    <Container>
        <Header showBackButton />

        <Highlight
            title={group}
            subtitle='Adicione a galera e separe os times'
        />

        <Form>
          <Input
            inputRef={newPlayerRef}
            value={player}
            onChangeText={setPlayer}
            placeholder='Nome da pessoa'
            autoCorrect={false}
            onSubmitEditing={handleAddPlayer}
            returnKeyType='done'
          />
          <ButtonIcon icon='add' onPress={handleAddPlayer} />
        </Form>

        <HeaderList>
          <FlatList
            data={['Time A', 'Time B']}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <Filter
                title={item}
                isActive={item === team}
                onPress={() => setTeam(item)}
              />
            )}
            horizontal
          />
          <NumberOfPlayers>{players.length}</NumberOfPlayers>
        </HeaderList>

        {loading ? <Loading /> : (
          <FlatList
            data={players}
            keyExtractor={item => item.name}
            renderItem={({ item }) => (
              <PlayerCard
                name={item.name}
                onRemove={() => handlePlayerRemove(item.name)}
              />
            )}
            ListEmptyComponent={() => (
              <ListEmpty message="Não há pessoas nesse time" />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[{ paddingBottom: 100 }, players.length === 0 && { flex: 1 }]}
          />
        )}

          <Button
            title="Remover Turma"
            type="SECONDARY"
            onPress={handleGroupRemove}
          />
    </Container>
  );
}
