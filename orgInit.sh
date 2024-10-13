# Create the demo org
sfdx shane:org:create -f config/project-scratch-def.json -d 3 -s --wait 60 --userprefix admin -o archive.demo
# sfdx force:org:create -f config/project-scratch-def.json --setalias archive-data --setdefaultusername

# Push the security settings first, otherwise the push will fail.
sf project deploy start -m Settings:Security

# Push the metadata into the new scratch org.
sf project deploy start

# Assign user the permset
sf org assign permset -n ArchiveData

# Set the default password.
sf demoutil user password set -p salesforce1 -g User -l User

# Open the org.
sf org open
# Update the dates in our demo data relative to the original data generation date.
sfdx shane:data:dates:update -r 5-20-2020

# Import the data required by the demo
sf automig load --inputdir ./data --deletebeforeload
