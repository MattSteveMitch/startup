#!/bin/bash

while getopts f: flag
do
    case "${flag}" in
        f) files=${OPTARG};;
    esac
done

printf "\n----> Deploying files for startup to starsight.click with ../Starsight access.pem\n"

if [[ -z "$files" ]] then

    printf "\n----> Clear out the previous distribution on the target.\n"
    ssh -i "../Starsight access.pem" ubuntu@starsight.click << ENDSSH
    rm -rf services/startup/public
    mkdir -p services/startup/public
ENDSSH

    printf "\n----> Copy the distribution package to the target.\n"
    scp -r -i "../Starsight access.pem" * ubuntu@starsight.click:services/startup/public
    exit 0
fi

# Step 2
printf "\n----> Copy the distribution files to the target.\n"
scp -r -i "../Starsight access.pem" $files ubuntu@starsight.click:services/startup/public

exit 0


'
#!/bin/bash

while getopts k:h:s: flag
do
    case "${flag}" in
        k) key=${OPTARG};;
        h) hostname=${OPTARG};;
        s) service=${OPTARG};;
    esac
done

if [[ -z "$key" || -z "$hostname" || -z "$service" ]]; then
    printf "\nMissing required parameter.\n"
    printf "  syntax: deployFiles.sh -k <pem key file> -h <hostname> -s <service>\n\n"
    exit 1
fi

printf "\n----> Deploying files for $service to $hostname with $key\n"

# Step 1
printf "\n----> Clear out the previous distribution on the target.\n"
ssh -i "$key" ubuntu@$hostname << ENDSSH
rm -rf services/${service}/public
mkdir -p services/${service}/public
ENDSSH

# Step 2
printf "\n----> Copy the distribution package to the target.\n"
scp -r -i "$key" * ubuntu@$hostname:services/$service/public
'
