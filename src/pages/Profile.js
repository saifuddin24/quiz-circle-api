import {useEffect} from "react";
import {User} from "../helpers/db";
import {useState} from "react";
import {Alert, Button, FieldError, InputField} from "../components/ui";
import {_values} from "../helpers/form";

export default () => {

    var loading = true;
    const [ userdata, setData ] = useState( {} );
    const [ message, setMessage ] = useState( {text:'', type: 'success' } );
    const [ form_values, setFormValues ] = useState( {} );
    const [ editing, setEditing ] = useState( false );
    const [ errors, setErrors ] = useState( { } );

    useEffect(function () {
        User.get()
            .then( ({data}) => {
                loading = false;
                setData( data.data );
                setFormValues( data.data );
                console.log( data.data );
                console.log( 'pp', Object.keys( userdata ) );
            })
            .catch(({response}) => {
                console.log(response);
            })

    }, [ loading ]);

    function submit_editing_form() {
        User.submit_editing_data( form_values )
            .then( ({data}) => {
                console.log( data );
                setData( data.data );
                setEditing( false );
                setMessage({text: data.message, type: 'success'})

                setTimeout( () => setMessage({text: '', type: 'success'}), 2000 )

            }).catch( ({response}) => {
                console.log( response );
                setErrors( response.data.errors );
                setMessage({text: response.data.message, type: 'warning'})
                setTimeout( () => setMessage({text: '', type: 'success'}), 5000 )
            });
    }
    

    function PasswordChange() {
        return <div>
            <span className='text-italic text-red-300'>(Secret)</span>
            <Button className='ml-2' size='xs' variant='outline-warning'>Change</Button>
        </div>
    }

    function ItemValue( {field} ) {
        if( field === 'password' )
            return <PasswordChange/>
        else {
            if( editing ) {
                return <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <InputField type='text'
                            onChange={ e => { setFormValues( _values( form_values, e ) ) } }
                            defaultValue={userdata[field]} name={field} />
                    <FieldError errors={errors} field={field}/>
                </dd>
            }

            return <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {( (userdata[field] == null ? <span className='text-italic text-gray-400'>(Empty)</span>
                    : userdata[field])) }
            </dd>
        }
    }

    function ProfileItem({field, label}){

        return <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
                {label}
            </dt>
            <ItemValue field={field}/>
        </div>
    }


    function ButtonContainer() {
        if(editing) {
            return <div className='flex'>
                <Button onClick={ () => { submit_editing_form( ) }} variant={'info'}>Save</Button>
                <Button className='ml-2'
                        onClick={() => { setEditing( false );}}
                        variant='outline-danger'
                >Cancel</Button>
            </div>
        }
        return <Button onClick={() => { setEditing( true )}}>Edit</Button>
    }

    return <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex">
            <div className='flex-grow'>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Account Informations
                </h3>
            </div>

            <div>
                <ButtonContainer/>
            </div>
        </div>
        <div className="border-t border-gray-200 p-4">
            <Alert variant={message.type} >{message.text}</Alert>
            <dl>
                <ProfileItem field='first_name' label='First Name' />
                <ProfileItem field='last_name' label='Last Name' />
                <ProfileItem field='email' label='Email' />
                <ProfileItem field='phone_number' label='Phone Number' />
                <div className='border-b border-gray-200'></div>
                <ProfileItem field='password' label='Password' />
            </dl>
        </div>



    </div>
}
