import { FormControl, ValidationErrors } from '@angular/forms';
export class PortalGamerValidators {

 // Validacion contra espacio en blanco
 static notOnlyWhitespace(control: FormControl) : ValidationErrors {
        
    // Verificar si String tiene espacion en blanco lo eliminamos con trim
    if ((control.value != null) && (control.value.trim().length === 0)) {

        // invalido, return error object
        return { 'notOnlyWhitespace': true };
    }
    else {
        // valido return null
        return null;
    }
}

}


