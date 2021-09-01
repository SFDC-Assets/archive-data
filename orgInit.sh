# Create the demo org
sfdx shane:org:create -f config/project-scratch-def.json -d 3 -s --wait 60 --userprefix admin -o archive.demo
# sfdx force:org:create -f config/project-scratch-def.json --setalias archive-data --setdefaultusername

# Push the security settings first, otherwise the push will fail.
sfdx force:source:deploy -m Settings:Security

# Push the metadata into the new scratch org.
sfdx force:source:push

# Assign user the permset
sfdx force:user:permset:assign -n ArchiveData

# Set the default password.
sfdx shane:user:password:set -g User -l User -p salesforce1

# Open the org.
sfdx force:org:open

# Update the dates in our demo data relative to the original data generation date.
sfdx shane:data:dates:update -r 5-20-2020

# Import the data required by the demo
sfdx automig:load --inputdir ./data --deletebeforeload
