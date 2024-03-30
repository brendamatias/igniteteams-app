import { TouchableOpacityProps } from 'react-native'
import { ButtonIconTypeStyleProps, Container, Icon } from "./styles";
import { MaterialIcons } from '@expo/vector-icons';

type ButtonIconProps = TouchableOpacityProps & {
    icon: keyof typeof MaterialIcons.glyphMap;
    type?: ButtonIconTypeStyleProps;
}

export function ButtonIcon({ icon, type = 'PRIMARY', ...rest }: ButtonIconProps) {
   return (
    <Container {...rest}>
        <Icon name={icon} type={type} />
    </Container>
   )
}