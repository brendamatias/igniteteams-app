import { Header } from '@components/Header';
import { Container } from './styles';
import { Highlight } from '@components/Highlight';
import { GroupCard } from '@components/GroupCard';
import { useCallback, useState } from 'react';
import { Alert, FlatList } from 'react-native';
import { ListEmpty } from '@components/ListEmpty';
import { Button } from '@components/Button';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { groupsGetAll } from '@storage/group/groupsGetAll';
import { Loading } from '@components/Loading';

export default function Groups() {
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<string[]>(['s'])
  const navigation = useNavigation();

  function handleNewGroup() {
    navigation.navigate('new');
  }

  function handleOpenGroup(group: string) {
    navigation.navigate('players', { group })
  }

  async function fetchGroups() {
    setLoading(true);

    try {
      const data = await groupsGetAll();

      setGroups(data);
    } catch (error) {
      console.log(error);
      Alert.alert('Turmas', 'Não foi possível carregar as turmas');
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(useCallback(() => {
    fetchGroups();
  }, []));

  return (
    <Container>
      <Header />
      <Highlight
        title='Turmas'
        subtitle='Jogue com a sua turma'
      />

      {loading ? <Loading /> : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <GroupCard
              title={item}
              onPress={() => handleOpenGroup(item)}
            />
          )}
          contentContainerStyle={groups.length === 0 && { flex: 1 }}
          ListEmptyComponent={() => (
            <ListEmpty
              message='Que tal cadastrar a primeira turma?'
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}


      <Button
        title='Criar nova turma'
        onPress={handleNewGroup}
      />
    </Container>
  );
}
